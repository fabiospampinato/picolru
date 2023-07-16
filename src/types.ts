
/* MAIN */

type Node<K, V> = {
  key: K,
  value: V,
  expiry: number,
  prev: Node<K, V> | null,
  next: Node<K, V> | null
};

type Options<K, V> = {
  maxAge?: number,
  maxSize: number,
  onEviction?: ( key: K, value: V ) => void
};

/* EXPORT */

export type {Node, Options};
