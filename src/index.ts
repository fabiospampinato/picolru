
/* IMPORT */

import type {Node, Options} from './types';

/* MAIN */

//TODO: Support a maxAge option, efficiently

class LRU<K, V> {

  /* VARIABLES */

  private nodes: Map<K, Node<K, V>>;
  private first: Node<K, V> | null;
  private last: Node<K, V> | null;

  private maxSize: number;
  private onEviction?: ( key: K, value: V ) => void;

  /* CONSTRUCTOR */

  constructor ( options: Options<K, V> ) {

    this.nodes = new Map ();
    this.first = null;
    this.last = null;

    this.maxSize = Math.max ( 0, options.maxSize );
    this.onEviction = options.onEviction;

  }

  /* GETTERS */

  get size (): number {

    return this.nodes.size;

  }

  /* API */

  clear (): void {

    this.nodes.clear ();
    this.first = null;
    this.last = null;

  }

  delete ( key: K ): boolean {

    const node = this.nodes.get ( key );

    if ( !node ) return false;

    this.nodes.delete ( node.key );

    if ( node.prev ) {
      node.prev.next = node.next;
    }

    if ( node.next ) {
      node.next.prev = node.prev;
    }

    if ( this.first === node ) {
      this.first = node.next;
    }

    if ( this.last === node ) {
      this.last = node.prev;
    }

    this.onEviction?.( node.key, node.value );

    return true;

  }

  get ( key: K ): V | undefined {

    const node = this.nodes.get ( key );

    if ( !node ) return;

    this.set ( node.key, node.value );

    return node.value;

  }

  has ( key: K ): boolean {

    return this.nodes.has ( key );

  }

  peek ( key: K ): V | undefined {

    return this.nodes.get ( key )?.value;

  }

  resize ( size: number ): this {

    this.maxSize = Math.max ( 0, size );

    if ( this.maxSize ) {

      while ( this.size > this.maxSize ) {

        const node = this.first;

        if ( !node ) break;

        this.delete ( node.key );

      }

    } else {

      this.clear ();

    }

    return this;

  }

  set ( key: K, value: V ): this {

    const node = this.nodes.get ( key );

    if ( node ) { // Update

      node.value = value;

      if ( this.last !== node ) {

        const last = this.last;
        const {prev, next} = node;

        if ( this.first === node ) {
          this.first = node.next;
        }

        node.next = null;
        node.prev = last;

        if ( last ) {
          last.next = node;
        }

        if ( prev ) {
          prev.next = next;
        }

        if ( next ) {
          next.prev = prev;
        }

        this.last = node;

      }

    } else { // Insert

      const node = {
        key,
        value,
        prev: this.last,
        next: null
      };

      this.nodes.set ( key, node );

      if ( this.size === 1 ) {

        this.first = node;

      } else if ( this.last ) {

        this.last.next = node;

      }

      this.last = node;

    }

    this.resize ( this.maxSize );

    return this;

  }

  /* ITERATION API */

  * [Symbol.iterator] (): IterableIterator<[K, V]> {

    yield * this.entries ();

  }

  * keys (): IterableIterator<K> {

    yield * this.nodes.keys ();

  }

  * values (): IterableIterator<V> {

    for ( const [_, node] of this.nodes ) {

      yield node.value;

    }

  }

  * entries (): IterableIterator<[K, V]> {

    for ( const [key, node] of this.nodes ) {

      yield [key, node.value];

    }

  }

  forEach ( callback: ( value: V, key: K, lru: LRU<K, V> ) => void, thisArg?: any ): void {

    for ( const [key, node] of this.nodes ) {

      callback.call ( thisArg, node.value, key, this );

    }

  }

}

/* EXPORT */

export default LRU;
export type {Options};
