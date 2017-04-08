export function partial(fn: any, ...a: any[]) {
  const slice = Array.prototype.slice;
  const args = slice.call(arguments, 1);
  return function (this: any) {
    return fn.apply(this, args.concat(slice.call(arguments, 0)));
  };
}

export function hashSetHasKey(hashSet: Object, key: string) {
  return hashSet.hasOwnProperty(key);
}

export function filterArray<T,U>(array: T[], comparer: (arrayValue: T, otherValue: U | null) => boolean, otherValue: U | null = null) {
  return array.filter((value) => { return comparer(value, otherValue); });
}