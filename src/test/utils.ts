import * as SimplePeer from 'simple-peer';
import { FirePeer } from '../firepeer';

export const waitConn = (firePeer: FirePeer) => {
  return new Promise<SimplePeer.Instance>((resolve, reject) => {
    firePeer.on('connection', connection => {
      resolve(connection);
    });
  });
};

export const waitData = (connection: SimplePeer.Instance) => {
  return new Promise<any>((resolve, reject) => {
    connection.on('data', (data: any) => {
      resolve(data);
    });
  });
};
