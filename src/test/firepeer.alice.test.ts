import test from 'ava';
import * as dotenv from 'dotenv';
dotenv.config();
import * as wrtc from 'wrtc';
import { FirePeer } from '../firepeer';
import firebase from './firebase.fixture';
import { waitConn } from './utils';

test.after(async t => {
  await firebase.app().delete();
});

test.serial('alice tries to connect to bob authenticated', async t => {
  const alice = new FirePeer({
    app: firebase.app(),
    id: 'alice',
    spOpts: { wrtc }
  });

  if (process.env.ALICE_EMAIL && process.env.ALICE_PASS) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(
        process.env.ALICE_EMAIL,
        process.env.ALICE_PASS
      );
  }

  await alice.connect(
    process.env.BOB_UID as string,
    'bob'
  );
  await waitConn(alice);
  t.pass();
});
