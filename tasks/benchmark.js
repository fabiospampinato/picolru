
/* IMPORT */

import LRU from '../dist/index.js';

/* MAIN */

for ( const [name, map] of [['map', new Map ()], ['lru', new LRU ({ maxSize: 100_000 })], ['lru.maxAge', new LRU ({ maxAge: 60_000, maxSize: 100_000 })]] ) {

  console.log ( '' );
  console.time ( name );

  console.time ( `${name}.init` );
  for ( let i = 0; i < 75_000; i++ ) {
    map.set ( i, i );
  }
  console.timeEnd ( `${name}.init` );

  console.time ( `${name}.get` );
  for ( let i = 0; i < 100_000; i++ ) {
    map.get ( i );
  }
  console.timeEnd ( `${name}.get` );

  console.time ( `${name}.has` );
  for ( let i = 0; i < 100_000; i++ ) {
    map.has ( i );
  }
  console.timeEnd ( `${name}.has` );

  console.time ( `${name}.set` );
  for ( let i = 50_000; i < 150_000; i++ ) {
    map.set ( i, i );
  }
  console.timeEnd ( `${name}.set` );

  console.time ( `${name}.delete` );
  for ( let i = 100_000; i < 150_000; i++ ) {
    map.delete ( i );
  }
  console.timeEnd ( `${name}.delete` );

  console.time ( `${name}.clear` );
  map.clear ();
  console.timeEnd ( `${name}.clear` );

  console.timeEnd ( name );

  map.dispose?.();

}
