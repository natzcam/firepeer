import { EventEmitter } from 'events';
import { FirePeer, FirePeerInstance } from '../firepeer';

export const waitConn = (firePeer: FirePeer): Promise<FirePeerInstance> => {
  return new Promise<FirePeerInstance>((resolve, reject) => {
    firePeer.on('connection', connection => {
      resolve(connection);
    });
  });
};

export const waitData = (connection: FirePeerInstance) => {
  return new Promise<any>((resolve, reject) => {
    connection.on('data', (data: any) => {
      resolve(data);
    });
  });
};

export const waitEvent = (emitter: EventEmitter, event: string) => {
  return new Promise<any>((resolve, reject) => {
    emitter.on(event, (data: any) => {
      resolve(data);
    });
  });
};

export const vars = {
  ALICE_EMAIL: process.env.ALICE_EMAIL as string,
  ALICE_PASS: process.env.ALICE_PASS as string,
  ALICE_UID: process.env.ALICE_UID as string,
  BOB_EMAIL: process.env.BOB_EMAIL as string,
  BOB_PASS: process.env.BOB_PASS as string,
  BOB_UID: process.env.BOB_UID as string,
  CHARLIE_EMAIL: process.env.CHARLIE_EMAIL as string,
  CHARLIE_PASS: process.env.CHARLIE_PASS as string,
  CHARLIE_UID: process.env.CHARLIE_UID as string
};
