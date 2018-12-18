import { EventEmitter } from 'events';
import firebase from 'firebase';
import * as shortid from 'shortid';
import * as SimplePeer from 'simple-peer';
import debug from './debug';

export interface FirePeerInstance extends SimplePeer.Instance {
  initiatorUid: string | null;
  initiatorId: string | null;
  receiverUid: string | null;
  recieveirId: string | null;
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
  public onOffer: (signal: Signal) => Promise<Signal> | Signal;
  public onAnswer: (signal: Signal) => Promise<Signal> | Signal;
  public sendOffer: (signal: Signal) => Promise<Signal> | Signal;
  public sendAnswer: (signal: Signal) => Promise<Signal> | Signal;
  private refs: firebase.database.Reference[] = [];

  constructor(options: Partial<FirePeer>) {
    super();
    if (options.app) {
      this.app = options.app;
    } else {
      throw new Error('firebase app is required!');
    }

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
        this.listen(user);
      } else {
        this.unlisten();
      }
    });
  }

  public connect(uid: string, id: string): void {
    if (!this.uid) {
      throw new Error('need to be logged in in order to connect');
    }
    this.createPeer(
      this.app.database().ref(`peers/${uid}/${id}/${this.uid}/${this.id}`),
      true
    );
  }

  private listen(user: firebase.User): void {
    this.refs = [];
    this.uid = user.uid;
    const ref = this.app.database().ref(`peers/${this.uid}/${this.id}`);
    ref.on('child_added', ss => {
      if (ss) {
        ss.ref.on('child_added', css => {
          if (css) {
            this.createPeer(css.ref, false);
          }
        });
        this.refs.push(ss.ref);
      }
    });
    this.refs.push(ref);
  }

  private unlisten(): void {
    this.refs.forEach(r => {
      r.off('child_added');
    });
  }

  private createPeer(
    ref: firebase.database.Reference,
    initiator: boolean
  ): FirePeerInstance {
    const peer = new SimplePeer({
      initiator,
      ...this.spOpts,
      trickle: false
    }) as FirePeerInstance;

    peer.on('signal', (signal: Signal) => {
      const p =
        signal.type === 'offer'
          ? Promise.resolve(this.sendOffer(signal))
          : Promise.resolve(this.sendAnswer(signal));

      p.then(sig => {
        if (sig) {
          ref.set(sig);
        }
      });
    });

    ref.on('value', ss => {
      if (ss) {
        const signal = ss.val();
        if (signal) {
          if (signal.type === 'offer' && !initiator) {
            Promise.resolve(this.onOffer(signal)).then(sig => {
              peer.signal(sig);
            });
          } else if (signal.type === 'answer' && initiator) {
            Promise.resolve(this.onAnswer(signal)).then(sig => {
              peer.signal(sig);
            });
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
      peer.initiatorId = ref && ref.key;
      peer.initiatorUid = ref && ref.parent && ref.parent.key;
      peer.recieveirId =
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
