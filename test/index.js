
/* IMPORT */

import {describe} from 'fava';
import {setTimeout as delay} from 'node:timers/promises';
import {makeEntries, makeLRU} from './fixtures.js';

/* MAIN */

describe ( 'PicoLRU', it => {

  /* API */

  it ( 'clear', t => {

    const lru = makeLRU ();

    t.is ( lru.peek ( 'a' ), 1 );
    t.is ( lru.has ( 'a' ), true );

    t.is ( lru.size, 5 );
    t.is ( lru.clear (), undefined );
    t.is ( lru.size, 0 );

    t.is ( lru.peek ( 'a' ), undefined );
    t.is ( lru.has ( 'a' ), false );

  });

  it ( 'delete', t => {

    const lru = makeLRU ();

    t.is ( lru.size, 5 );
    t.is ( lru.delete ( 'f' ), false );
    t.is ( lru.delete ( 'a' ), true );
    t.is ( lru.delete ( 'a' ), false );
    t.is ( lru.size, 4 );
    t.is ( lru.set ( 'f', '6' ), lru );
    t.is ( lru.size, 5 );
    t.is ( lru.set ( 'g', '7' ), lru );
    t.is ( lru.size, 5 );

  });

  it ( 'get', t => {

    const lru = makeLRU ();

    t.is ( lru.get ( 'a' ), 1 );
    t.is ( lru.set ( 'f', 6 ), lru );

    t.is ( lru.peek ( 'f' ), 6 );
    t.is ( lru.peek ( 'a' ), 1 );
    t.is ( lru.peek ( 'b' ), undefined );

  });

  it ( 'has', t => {

    const lru = makeLRU ();

    t.is ( lru.has ( 'a' ), true );
    t.is ( lru.has ( 'f' ), false );

    t.is ( lru.set ( 'f', 6 ), lru );

    t.is ( lru.has ( 'f' ), true );
    t.is ( lru.has ( 'a' ), false );

  });

  it ( 'peek', t => {

    const lru = makeLRU ();

    t.is ( lru.peek ( 'a' ), 1 );
    t.is ( lru.set ( 'f', 6 ), lru );

    t.is ( lru.peek ( 'f' ), 6 );
    t.is ( lru.peek ( 'a' ), undefined );

  });

  it ( 'resize', t => {

    const lru = makeLRU ();

    t.is ( lru.size, 5 );
    t.is ( lru.peek ( 'a' ), 1 );
    t.is ( lru.set ( 'f', 6 ), lru );
    t.is ( lru.peek ( 'a' ), undefined );
    t.is ( lru.peek ( 'f' ), 6 );
    t.is ( lru.size, 5 );

    t.is ( lru.resize ( 6 ), lru );

    t.is ( lru.size, 5 );
    lru.set ( 'g', 7 );
    t.is ( lru.peek ( 'b' ), 2 );
    t.is ( lru.peek ( 'g' ), 7 );
    t.is ( lru.size, 6 );

    lru.resize ( 3 );

    t.is ( lru.size, 3 );
    t.is ( lru.peek ( 'b' ), undefined );
    t.is ( lru.peek ( 'c' ), undefined );
    t.is ( lru.peek ( 'd' ), undefined );

  });

  it ( 'set', t => {

    const lru = makeLRU ();

    t.is ( lru.set ( 'f', 6 ), lru );

    t.is ( lru.peek ( 'f' ), 6 );
    t.is ( lru.peek ( 'a' ), undefined );
    t.is ( lru.peek ( 'b' ), 2 );

    t.is ( lru.set ( 'b', 2 ), lru );
    t.is ( lru.set ( 'g', 7 ), lru );

    t.is ( lru.peek ( 'b' ), 2 );
    t.is ( lru.peek ( 'g' ), 7 );
    t.is ( lru.peek ( 'c' ), undefined );

  });

  /* ITERATION API */

  it ( '* Symbol.iterator', t => {

    const entries = makeEntries ();
    const lru = makeLRU ();

    for ( const entry of lru ) {

      t.deepEqual ( entry, entries.shift () );

    }

  });

  it ( '* keys', t => {

    const entries = makeEntries ();
    const lru = makeLRU ();

    for ( const key of lru.keys () ) {

      t.deepEqual ( key, entries.shift ()[0] );

    }

  });

  it ( '* values', t => {

    const entries = makeEntries ();
    const lru = makeLRU ();

    for ( const value of lru.values () ) {

      t.deepEqual ( value, entries.shift ()[1] );

    }

  });

  it ( '* entries', t => {

    const entries = makeEntries ();
    const lru = makeLRU ();

    for ( const entry of lru ) {

      t.deepEqual ( entry, entries.shift () );

    }

  });

  it ( 'forEach', t => {

    const entries = makeEntries ();
    const lru = makeLRU ();
    const thiz = {};

    lru.forEach ( function ( value, key, self ) {

      t.deepEqual ( [value, key, self, this], [...entries.shift ().reverse (), lru, thiz] );

    }, thiz );

  });

  /* EXTRA */

  it ( 'supports a maxAge parameter, inserting', async t => {

    const lru = makeLRU ({ maxAge: 99 });

    t.is ( lru.size, 5 );

    await delay ( 100 );

    t.is ( lru.size, 0 );

    lru.dispose ();

  });

  it ( 'supports a maxAge parameter, updating', async t => {

    const lru = makeLRU ({ maxAge: 99 });

    await delay ( 50 );

    t.is ( lru.size, 5 );
    t.is ( lru.set ( 'a', 1 ), lru );

    await delay ( 50 );

    t.is ( lru.size, 1 );

    await delay ( 100 );

    t.is ( lru.size, 0 );

    lru.dispose ();

  });

});
