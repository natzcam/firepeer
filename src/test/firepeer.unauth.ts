import test from 'ava';
import * as dotenv from 'dotenv';
dotenv.config();
import * as wrtc from 'wrtc';
import { FirePeer } from '../firepeer';
import firebase from './firebase.fixture';

test.serial('alice tries to connect to bob unauthenticated', async t => {
  const alice = new FirePeer({
    app: firebase.app(),
    spOpts: { wrtc }
  });
  alice.connect(
    process.env.BOB_UID as string,
    'bobclient1'
  );
});
