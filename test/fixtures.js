
/* IMPORT */

import LRU from '../dist/index.js';

/* MAIN */

const makeEntries = () => {

  return [
    ['a', 1],
    ['b', 2],
    ['c', 3],
    ['d', 4],
    ['e', 5]
  ];

};

const makeLRU = options => {

  const entries = makeEntries ();
  const lru = new LRU ({ maxSize: 5, ...options });

  entries.forEach ( ([ key, value ]) => {

    lru.set ( key, value );

  });

  return lru;

};

/* EXPORT */

export {makeEntries, makeLRU};
