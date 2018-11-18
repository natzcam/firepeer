import test from 'ava';
import * as dotenv from 'dotenv';
dotenv.config();
import * as wrtc from 'wrtc';
import { FirePeer } from '../../firepeer';
import firebase from './firebase.fixture';

test.before(async t => {
  if (process.env.ALICE_EMAIL && process.env.ALICE_PASS) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(
        process.env.ALICE_EMAIL,
        process.env.ALICE_PASS
      );
  }
});

test.after(async t => {
  await firebase.app().delete();
});

test.serial('alice tries to connect to bob authenticated', async t => {
  const alice = new FirePeer(firebase, { wrtc });
  await alice.connect(process.env.BOB_UID as string);
  t.pass();
});
