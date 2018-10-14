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
});

test.serial('alice tries to connect to bob unauthenticated', async t => {
  const context: any = t.context as any;
  const alice = new FirePeer(context.alice, { wrtc });
  await t.throwsAsync(alice.connect(context.bob));
});
