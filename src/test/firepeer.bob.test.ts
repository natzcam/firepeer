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

test.serial('bob waits for connection from alice authenticated', async t => {
  const bob = new FirePeer({
    app: firebase.app(),
    id: 'bob',
    spOpts: { wrtc }
  });
  if (process.env.BOB_EMAIL && process.env.BOB_PASS) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(process.env.BOB_EMAIL, process.env.BOB_PASS);
  }

  const peer = await waitConn(bob);
  t.is(peer.initiatorId, 'alice');
  t.pass();
});
