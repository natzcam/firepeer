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
