import { EventEmitter } from 'events';
import firebase from 'firebase';
import * as shortid from 'shortid';
import * as SimplePeer from 'simple-peer';
import debug from './debug';

/**
 * @noInheritDoc
 */
export interface FirePeerInstance extends SimplePeer.Instance {
  initiatorUid: string | null;
  initiatorId: string | null;
  receiverUid: string | null;
  receiverId: string | null;
}
export interface Signal extends SimplePeer.SignalData {
  type: 'offer' | 'answer';
  error?: string;
}

export interface FirePeerOptions {
  id?: string;
  spOpts?: SimplePeer.Options;
  onOffer?: (signal: Signal) => Promise<Signal> | Signal;
  onAnswer?: (signal: Signal) => Promise<Signal> | Signal;
  sendOffer?: (signal: Signal) => Promise<Signal> | Signal;
  sendAnswer?: (signal: Signal) => Promise<Signal> | Signal;
}

export declare interface FirePeer {
  on(event: 'connection', listener: (peer: FirePeerInstance) => void): this;
  on(event: 'loggedin' | 'loggedout', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
}

/**
 * @noInheritDoc
 */
export class FirePeer extends EventEmitter {
  public id: string;
  public uid?: string | null;
  private app: firebase.app.App;
  private refs: firebase.database.Reference[] = [];
  private spOpts?: SimplePeer.Options;
  private onOffer: (signal: Signal) => Promise<Signal> | Signal;
  private onAnswer: (signal: Signal) => Promise<Signal> | Signal;
  private sendOffer: (signal: Signal) => Promise<Signal> | Signal;
  private sendAnswer: (signal: Signal) => Promise<Signal> | Signal;

  constructor(fbaseOrApp: any, options: FirePeerOptions = {}) {
    super();
    this.app = fbaseOrApp as firebase.app.App;

    this.id = options.id ? options.id : shortid.generate();
    this.spOpts = options.spOpts ? options.spOpts : {};
    this.onOffer = options.onOffer
      ? options.onOffer
      : (signal: Signal) => signal;
    this.onAnswer = options.onAnswer
      ? options.onAnswer
      : (signal: Signal) => signal;
    this.sendOffer = options.sendOffer
      ? options.sendOffer
      : (signal: Signal) => signal;
    this.sendAnswer = options.sendAnswer
      ? options.sendAnswer
      : (signal: Signal) => signal;

    this.app.auth().onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;
        this.listen();
        this.emit('loggedin');
      } else {
        this.uid = null;
        this.unlisten();
        this.emit('loggedout');
      }
    });
  }

  public connect(uid: string, id: string): Promise<FirePeerInstance> {
    return new Promise((resolve, reject) => {
      const connectPeer = () => {
        const ref = this.app
          .database()
          .ref(`peers/${uid}/${id}/${this.uid}/${this.id}`);

        debug(this.id)('connecting to %s', ref);
        const peer = this.createPeer(ref, true);
        peer.on('connect', () => {
          resolve(peer);
        });
        peer.on('error', err => {
          reject(err);
        });
      };

      if (this.uid) {
        connectPeer();
      } else {
        this.on('loggedin', connectPeer);
      }
    });
  }

  private handleError(err: Error | null): void {
    if (err) {
      debug(this.id)(err);
      this.emit('error', err);
    }
  }

  private listen(): void {
    this.refs = [];
    const ref = this.app.database().ref(`peers/${this.uid}/${this.id}`);
    ref.on(
      'child_added',
      ss => {
        if (ss) {
          ss.ref.on(
            'child_added',
            css => {
              if (css) {
                this.createPeer(css.ref, false);
              }
            },
            this.handleError
          );
          this.refs.push(ss.ref);
        }
      },
      this.handleError
    );
    this.refs.push(ref);
    debug(this.id)('listening to %s', ref);
  }

  private unlisten(): void {
    this.refs.forEach(r => {
      debug(this.id)('unlisten to %s', r);
      r.off('child_added');
    });
  }

  private createPeer(
    ref: firebase.database.Reference,
    initiator: boolean
  ): FirePeerInstance {
    debug(this.id)('createPeer(): initiator: %s, %s', initiator, ref);
    const peer = new SimplePeer({
      initiator,
      ...this.spOpts,
      trickle: false
    }) as FirePeerInstance;

    peer.on('signal', (signal: Signal) => {
      Promise.resolve(
        signal.type === 'offer'
          ? this.sendOffer(signal)
          : this.sendAnswer(signal)
      ).then(
        sig => {
          if (sig) {
            debug(this.id)('local signal: %s', signal.type);
            ref.set(sig, this.handleError);
          } else {
            debug(this.id)('local signal empty: %s', signal.type);
          }
        },
        () => {
          debug(this.id)('local signal rejected: %s', signal.type);
        }
      );
    });

    ref.on(
      'value',
      ss => {
        if (ss) {
          const signal = ss.val() as Signal;
          if (signal) {
            if (
              (signal.type === 'offer' && !initiator) ||
              (signal.type === 'answer' && initiator)
            ) {
              if (signal.error) {
                debug(this.id)(signal.error);
                peer.emit('error', signal.error);
              } else {
                Promise.resolve(
                  signal.type === 'offer'
                    ? this.onOffer(signal)
                    : this.onAnswer(signal)
                ).then(
                  sig => {
                    if (sig) {
                      debug(this.id)('remote signal: %s', signal.type);
                      peer.signal(sig);
                    } else {
                      debug(this.id)('remote signal rejected: %s', signal.type);
                      ref.set(
                        {
                          error: 'signal rejected by remote peer',
                          type: signal.type
                        },
                        this.handleError
                      );
                    }
                  },
                  () => {
                    debug(this.id)('remote signal rejected: %s', signal.type);
                    ref.set(
                      {
                        error: 'signal rejected by remote peer',
                        type: signal.type
                      },
                      this.handleError
                    );
                  }
                );
              }
            }
          }
        }
      },
      this.handleError
    );

    const cleanup = () => {
      ref.off('value');
      ref.set(null, this.handleError);
      debug(this.id)('cleanup');
    };

    peer.on('close', cleanup);
    peer.on('connect', () => {
      debug(this.id)('connection established');

      cleanup();
      peer.initiatorId = ref && ref.key;
      peer.initiatorUid = ref && ref.parent && ref.parent.key;
      peer.receiverId =
        ref && ref.parent && ref.parent.parent && ref.parent.parent.key;
      peer.receiverUid =
        ref &&
        ref.parent &&
        ref.parent.parent &&
        ref.parent.parent.parent &&
        ref.parent.parent.parent.key;

      this.emit('connection', peer);
    });

    return peer;
  }
}
