import test from 'ava';
import * as dotenv from 'dotenv';
dotenv.config();
import * as wrtc from 'wrtc';
import { FirePeer } from '../../firepeer';
import { waitConn } from '../utils';
import firebase from './firebase.fixture';

test.before(async t => {
  if (process.env.BOB_EMAIL && process.env.BOB_PASS) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(process.env.BOB_EMAIL, process.env.BOB_PASS);
  }
});

test.after(async t => {
  await firebase.app().delete();
});

test.serial('bob waits for connection from alice authenticated', async t => {
  const bob = new FirePeer(firebase, { wrtc });
  await waitConn(bob);
  t.pass();
});
