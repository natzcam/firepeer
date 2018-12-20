import test from 'ava';
import * as dotenv from 'dotenv';
dotenv.config();
import * as wrtc from 'wrtc';
import { FirePeer } from '../firepeer';
import firebase from './firebase.fixture';
import { vars } from './utils';

test.before(async t => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(
      vars.ALICE_EMAIL as string,
      vars.ALICE_PASS as string
    );
});

test.after(async t => {
  await firebase.app().delete();
});

test('alice tries to connect to bob authenticated', async t => {
  const alice = new FirePeer(firebase, {
    id: 'alice1',
    spOpts: { wrtc }
  });

  const peer = await alice.connect(
    vars.BOB_UID as string,
    'bob1'
  );
  t.is(peer.initiatorId, 'alice1');
  t.is(peer.initiatorUid, vars.ALICE_UID);
  t.is(peer.receiverId, 'bob1');
  t.is(peer.receiverUid, vars.BOB_UID);
  t.pass();
});
