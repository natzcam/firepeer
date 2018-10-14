import test from 'ava';
import * as dotenv from 'dotenv';
dotenv.config();
import * as wrtc from 'wrtc';
import { FirePeer } from '../../firepeer';
import { waitConn } from '../utils';
import firebase from './firebase.fixture';

test.before(async t => {
  const alice = firebase.database().ref(`test/${process.env.ALICE_UID}`);
  const bob = firebase.database().ref(`test/${process.env.BOB_UID}`);
  t.context = {
    alice,
    bob
  };

  if (process.env.BOB_EMAIL && process.env.BOB_PASS) {
    const cred = await firebase
      .auth()
      .signInWithEmailAndPassword(process.env.BOB_EMAIL, process.env.BOB_PASS);

    (t.context as any).user = cred.user;
  }
});

test.after(async t => {
  await firebase.app().delete();
});

test.serial('bob waits for connection from alice authenticated', async t => {
  const context: any = t.context as any;
  const bob = new FirePeer(context.bob, { wrtc, user: context.user });
  await waitConn(bob);
  t.pass();
});
