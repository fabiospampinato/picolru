# PicoLRU

A tiny LRU implementation that strives for simplicity and performance.

An LRU instance works identically to a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) instance, except that a maximum of `maxSize` items are remembered, the least recently used items exceeding that size are deleted automatically, and a couple of extra methods are provided: `peek` and `resize`.

## Install

```sh
npm install --save picolru
```

## Usage

```ts
import LRU from 'picolru';

// Let's create an LRU

const lru = new LRU<string, number> ({
  maxSize: 3, // Maximum number of entries to remember
  onEviction: ( key, value ) => { // Optional callback for deleted entries
    console.log ( 'Entry deleted:', {key, value} );
  };
});

// Let's use it with the same exact APIs that a Map has
// Calling .set or .get makes the target entry the most recently used entry

lru.size; // => 0

lru.set ( 'a', 1 );
lru.set ( 'b', 2 );
lru.set ( 'c', 3 );

lru.size; // => 3

lru.get ( 'a' ); // => 1
lru.get ( 'd' ); // => undefined

lru.set ( 'd', 4 );

lru.size; // => 3

lru.has ( 'a' ); // => true
lru.has ( 'b' ); // => false

lru.delete ( 'd' ); // => true

for ( const [key, value] of lru ) { // Entries are iterated in insertion order, just like a regular Map
  console.log ({ key, value });
}

lru.clear ();

lru.size; // => 0

// A couple of extra APIs are provided also

lru.peek ( 'a' ); // => undefined, like .get, but this doesn't make the target entry the most recently used item

lru.resize ( 100 ); // This changes the "maxSize" value for the LRU, it can used to either grow it or shrink it
```

## License

MIT © Fabio Spampinato
