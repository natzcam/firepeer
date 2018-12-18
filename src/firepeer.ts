import { EventEmitter } from 'events';
import firebase from 'firebase';
import * as shortid from 'shortid';
import * as SimplePeer from 'simple-peer';
import debug from './debug';

export interface FirePeerInstance extends SimplePeer.Instance {
  uid: string;
  id: string;
}
export declare interface FirePeer {
  on(event: 'connection', listener: (peer: FirePeerInstance) => void): this;
}

export interface Signal extends SimplePeer.SignalData {
  uid: string;
  id: string;
  type: 'offer' | 'answer';
}

export class FirePeer extends EventEmitter {
  public app: firebase.app.App;
  public id: string;
  public uid?: string;
  public spOpts?: SimplePeer.Options;
  private ref?: firebase.database.Reference;

  constructor(options: Partial<FirePeer>) {
    super();
    if (options.app) {
      this.app = options.app;
    } else {
      throw new Error('firebase app is required!');
    }

    this.id = options.id ? options.id : shortid.generate();
    this.spOpts = options.spOpts ? options.spOpts : {};

    this.app.auth().onAuthStateChanged(user => {
      if (user) {
        this.listen(user);
      } else {
        this.unlisten();
      }
    });
  }

  public connect(uid: string, id: string): void {
    this.createPeer(
      this.app.database().ref(`peers/${uid}/${id}/${this.id}`),
      true
    );
  }

  private listen(user: firebase.User): void {
    this.uid = user.uid;
    this.ref = this.app.database().ref(`peers/${this.uid}/${this.id}`);

    this.ref.on('child_added', ss => {
      if (ss) {
        debug('%s: listen() to %s', this.id, ss.ref.toString());
        this.createPeer(ss.ref, false);
      }
    });
  }

  private unlisten(): void {
    if (this.ref) {
      this.ref.off('child_added');
    }
  }

  // private allowOffer: (offer: Signal) => boolean = (offer: Signal) => true;

  private createPeer(
    ref: firebase.database.Reference,
    initiator: boolean
  ): FirePeerInstance {
    debug('%s: createPeer() to %s, %s', this.id, ref.toString(), initiator);
    const peer = new SimplePeer({
      initiator,
      ...this.spOpts,
      trickle: false
    }) as FirePeerInstance;

    peer.on('signal', (signal: Signal) => {
      debug('%s: on signal %s, %o', this.id, initiator, signal);
      signal.id = this.id;
      if (this.uid) {
        signal.uid = this.uid;
      }
      ref.set(signal);
    });

    ref.on('value', ss => {
      if (ss) {
        const signal = ss.val();
        if (signal) {
          debug('%s, on value %s, %o', this.id, initiator, signal);
          if (signal.type === 'offer' && !initiator) {
            peer.signal(signal);
          } else if (signal.type === 'answer' && initiator) {
            peer.signal(signal);
          }
        }
      }
    });

    const cleanup = (err?: Error) => {
      debug('cleanup');
      if (err) {
        debug(err);
      }
      ref.off('value');
      ref.set(null);
    };

    peer.on('close', cleanup);
    peer.on('error', cleanup);
    peer.on('connect', () => {
      cleanup();
      this.emit('connection', peer);
    });

    return peer;
  }
}
