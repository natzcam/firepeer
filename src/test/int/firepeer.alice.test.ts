import test from 'ava';
import * as dotenv from 'dotenv';
dotenv.config();
import * as wrtc from 'wrtc';
import { FirePeer } from '../../firepeer';
import firebase from './firebase.fixture';

test.before(async t => {
  const alice = firebase.database().ref(`test/${process.env.ALICE_UID}`);
  const bob = firebase.database().ref(`test/${process.env.BOB_UID}`);
  t.context = {
    alice,
    bob
  };

  if (process.env.ALICE_EMAIL && process.env.ALICE_PASS) {
    const cred = await firebase
      .auth()
      .signInWithEmailAndPassword(
        process.env.ALICE_EMAIL,
        process.env.ALICE_PASS
      );
    (t.context as any).user = cred.user;
  }
});

test.after(async t => {
  await firebase.app().delete();
});

test.serial('alice tries to connect to bob authenticated', async t => {
  const context: any = t.context as any;
  const alice = new FirePeer(context.alice, {
    user: context.user,
    wrtc
  });
  await alice.connect(context.bob);
  t.pass();
});
