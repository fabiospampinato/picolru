
/* MAIN */

type Node<K, V> = {
  key: K,
  value: V,
  prev: Node<K, V> | null,
  next: Node<K, V> | null
};

type Options<K, V> = {
  maxSize: number,
  onEviction?: ( key: K, value: V ) => void
};

/* EXPORT */

export type {Node, Options};
