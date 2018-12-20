import debug from 'debug';

export default (id: string) => {
  return debug('firepeer:' + id);
};
