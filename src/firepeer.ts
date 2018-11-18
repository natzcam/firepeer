import { EventEmitter } from 'events';
import firebase from 'firebase';
import * as SimplePeer from 'simple-peer';
import debug from './debug';

export declare interface FirePeer {
  on(event: 'connection', listener: (peer: SimplePeer.Instance) => void): this;
}

export interface FirePeerOptions {
  wrtc?: any;
  peersPath?: string;
  offersPath?: string;
  answerPath?: string;
  uidPath?: string;
}

export class FirePeer extends EventEmitter {
  private ref?: firebase.database.Reference;
  private refSub: any;
  private wrtc?: any;
  private user: firebase.User | null | undefined;
  private peersPath = 'peers';
  private offersPath = 'offers';
  private answerPath = 'answer';
  private uidPath = 'uid';

  constructor(private fb: typeof firebase, options?: FirePeerOptions) {
    super();
    Object.assign(this, options);

    this.fb.auth().onAuthStateChanged(user => {
      this.user = user;
      if (this.user) {
        this.listen(this.user);
      } else {
        this.unlisten();
      }
    });
  }

  public connect(id: string): Promise<SimplePeer.Instance> {
    const offersRef = this.fb
      .database()
      .ref(`${this.peersPath}/${id}/${this.offersPath}`);

    debug('connect() %s', offersRef.toString());

    return new Promise((resolve, reject) => {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        wrtc: this.wrtc
      });

      peer.on('signal', (offer: any) => {
        if (this.user) {
          offer[this.uidPath] = this.user.uid;
        }

        debug('connect() offer: %o', offer);
        const offerRef = offersRef.push(offer);
        offerRef.then(
          () => debug('connect() push success %s', offerRef.toString()),
          err => peer.emit('error', err)
        );
        const answerRef = offerRef.child(this.answerPath);
        const answerSub: any = answerRef.on(
          'value',
          ss => {
            const answer = ss && (ss.val() as SimplePeer.SignalData);
            if (answer) {
              debug('connect() answer: %o', answer);
              peer.signal(answer);
            }
          },
          (err: Error) => {
            peer.emit('error', err);
          }
        );

        const cleanup = (err?: Error) => {
          if (answerRef && answerSub) {
            answerRef.off('value', answerSub);
          }
          if (offerRef) {
            offerRef.set(null);
          }
          if (err) {
            debug(err);
            reject(err);
          }
        };

        peer.on('error', cleanup);
        peer.on('connect', () => {
          cleanup();
          peer.removeListener('error', cleanup);
          resolve(peer);
        });
      });
    });
  }

  private listen(user: firebase.User): void {
    this.ref = this.fb
      .database()
      .ref(`${this.peersPath}/${user.uid}/${this.offersPath}`);

    debug('listen() to %s', this.ref.toString());
    this.refSub = this.ref.on('child_added', offerSnapshot => {
      if (offerSnapshot) {
        const offer = offerSnapshot.val() as SimplePeer.SignalData;
        if (offer) {
          this.incoming(offerSnapshot.ref, offer);
        }
      }
    });
  }

  private unlisten(): void {
    if (this.ref && this.refSub) {
      this.ref.off('child_added', this.refSub);
    }
  }

  private incoming(
    ref: firebase.database.Reference,
    offer: SimplePeer.SignalData
  ): void {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      wrtc: this.wrtc
    });

    const cleanup = (err?: Error) => {
      if (err) {
        debug(err);
      }
      ref.set(null);
    };

    debug('incoming() offer: %o', offer);
    peer.on('signal', (answer: SimplePeer.SignalData) => {
      debug('incoming() answer: %o', answer);
      ref.child(this.answerPath).set(answer);
    });
    peer.signal(offer);

    peer.on('error', cleanup);
    peer.on('connect', () => {
      cleanup();
      peer.removeListener('error', cleanup);
    });

    peer.on('connect', () => {
      this.emit('connection', peer);
    });
  }
}
