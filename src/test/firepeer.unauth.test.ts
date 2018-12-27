import test from 'ava';
import * as dotenv from 'dotenv';
dotenv.config();
import firebase from './firebase.fixture';
import { vars } from './utils';

test.after(async t => {
  await firebase.app().delete();
});

test.serial('unauthorized listen #1', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.BOB_UID}`)
      .once('value')
  );
});

test.serial('unauthorized set #1', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.BOB_UID}`)
      .set({
        sdp: 'hello',
        type: 'offer'
      })
  );
});

test.serial('unauthorized listen #2', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.BOB_UID}/bob1`)
      .once('value')
  );
});

test.serial('unauthorized set #2', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.BOB_UID}/bob1`)
      .set({
        sdp: 'hello',
        type: 'offer'
      })
  );
});

test.serial('unauthorized listen #3', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.BOB_UID}/bob1/${vars.ALICE_UID}`)
      .once('value')
  );
});

test.serial('unauthorized set #3', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.BOB_UID}/bob1/${vars.ALICE_UID}`)
      .set({
        sdp: 'hello',
        type: 'offer'
      })
  );
});

test.serial('unauthorized listen #4', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.BOB_UID}/bob1/${vars.ALICE_UID}/alice1`)
      .once('value')
  );
});

test.serial('unauthorized set #4', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.BOB_UID}/bob1/${vars.ALICE_UID}/alice1`)
      .set({
        sdp: 'hello',
        type: 'offer'
      })
  );
});

test('invalid set #1', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.ALICE_UID}/test/${vars.CHARLIE_UID}/test`)
      .set({
        invalid: 'invalid' // invalid
      })
  );
});

test.serial('invalid set #2', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.ALICE_UID}/test/${vars.CHARLIE_UID}/test`)
      .set({
        sdp: new Array(4000 + 1).join('n'), // invalid
        type: 'offer'
      })
  );
});

test.serial('invalid set #3', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.ALICE_UID}/test/${vars.CHARLIE_UID}/test`)
      .set({
        sdp: 'hey',
        type: 'hello' // invalid
      })
  );
});

test.serial('invalid set #4', async t => {
  await t.throwsAsync(
    firebase
      .database()
      .ref(`/peers/${vars.ALICE_UID}/test/${vars.CHARLIE_UID}/test`)
      .set({
        invalid: 'invalid',
        sdp: 'hey',
        type: 'offer'
      })
  );
});
