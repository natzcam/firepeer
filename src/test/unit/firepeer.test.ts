import test from 'ava';
import * as SimplePeer from 'simple-peer';
import * as wrtc from 'wrtc';
import { FirePeer } from '../../firepeer';
import firebase from './firebase.fixture';

const waitConn = (firePeer: FirePeer) => {
  return new Promise<SimplePeer.Instance>((resolve, reject) => {
    firePeer.on('connection', connection => {
      resolve(connection);
    });
  });
};

const waitData = (connection: SimplePeer.Instance) => {
  return new Promise<any>((resolve, reject) => {
    connection.on('data', (data: any) => {
      resolve(data);
    });
  });
};

test.beforeEach(t => {
  const alice = firebase.database().ref('alice' + Math.random());
  alice.autoFlush(500);
  const bob = firebase.database().ref('bob' + Math.random());
  bob.autoFlush(500);
  const charlie = firebase.database().ref('charlie' + Math.random());
  charlie.autoFlush(500);
  t.context = {
    alice,
    bob,
    charlie
  };
});

test('alice and bob connected', async t => {
  const context: any = t.context as any;
  const alice = new FirePeer(context.alice, { wrtc });
  const bob = new FirePeer(context.bob, { wrtc });

  await Promise.all([alice.connect(context.bob), waitConn(bob)]);
  t.pass();
});

test('alice and bob, exchange messages', async t => {
  const context: any = t.context as any;
  const alice = new FirePeer(context.alice, { wrtc });
  const bob = new FirePeer(context.bob, { wrtc });

  await Promise.all([
    alice.connect(context.bob).then(async connection => {
      connection.send('hey');
      const d = await waitData(connection);
      t.is(d.toString(), 'hello');
    }),
    waitConn(bob).then(async connection => {
      connection.send('hello');
      const d = await waitData(connection);
      t.is(d.toString(), 'hey');
    })
  ]);
});

test('alice, bob and charlie connected', async t => {
  const context: any = t.context as any;
  const alice = new FirePeer(context.alice, { wrtc });
  const bob = new FirePeer(context.bob, { wrtc });
  const charlie = new FirePeer(context.charlie, { wrtc });

  await Promise.all([
    alice.connect(context.bob),
    alice.connect(context.charlie),
    waitConn(bob),
    waitConn(charlie)
  ]);
  t.pass();
});

test('alice, bob and charlie connected 2', async t => {
  const context: any = t.context as any;
  const alice = new FirePeer(context.alice, { wrtc });
  const bob = new FirePeer(context.bob, { wrtc });
  const charlie = new FirePeer(context.charlie, { wrtc });

  await Promise.all([
    charlie.connect(context.alice),
    bob.connect(context.alice),
    waitConn(alice).then(() => {
      return waitConn(alice);
    })
  ]);
  t.pass();
});

test('alice, bob and charlie connected 3', async t => {
  const context: any = t.context as any;
  const alice = new FirePeer(context.alice, { wrtc });
  const bob = new FirePeer(context.bob, { wrtc });
  const charlie = new FirePeer(context.charlie, { wrtc });

  await Promise.all([
    alice.connect(context.bob),
    bob.connect(context.charlie),
    charlie.connect(context.alice),
    waitConn(alice),
    waitConn(bob),
    waitConn(charlie)
  ]);
  t.pass();
});
