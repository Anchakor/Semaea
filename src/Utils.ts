export function partial(fn: Function, ...a: unknown[]) {
  const slice = Array.prototype.slice;
  const args = slice.call(arguments, 1);
  return function (this: unknown) {
    return fn.apply(this, args.concat(slice.call(arguments, 0)));
  };
}

export function hashSetHasKey(hashSet: Object, key: string) {
  return hashSet.hasOwnProperty(key);
}

export function filterArray<T,U>(array: T[], comparer: (arrayValue: T, otherValue?: U) => boolean, otherValue?: U) {
  return array.filter((value) => { return comparer(value, otherValue); });
}