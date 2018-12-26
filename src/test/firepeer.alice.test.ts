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

test('alice tries to connect to bob authenticated - allow', async t => {
  const alice = new FirePeer(firebase, {
    id: 'alice2',
    spOpts: { wrtc }
  });

  const peer = await alice.connect(
    vars.BOB_UID as string,
    'bob2'
  );
  t.is(peer.initiatorId, 'alice2');
  t.is(peer.initiatorUid, vars.ALICE_UID);
  t.is(peer.receiverId, 'bob2');
  t.is(peer.receiverUid, vars.BOB_UID);
  t.pass();
});

// test.cb('alice tries to connect to bob authenticated - deny', t => {
//   const alice = new FirePeer(firebase, {
//     id: 'alice3',
//     spOpts: { wrtc }
//   });

//   alice
//     .connect(
//       vars.BOB_UID as string,
//       'bob3'
//     )
//     .catch(err => {
//       t.is(err, 'signal rejected by remote peer');
//       t.end();
//     });
// });
