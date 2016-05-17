class Utils {
  static partial(fn, ...a) {
    const slice = Array.prototype.slice;
    const args = slice.call(arguments, 1);
    return function () {
      return fn.apply(this, args.concat(slice.call(arguments, 0)));
    };
  }

  static hashSetHasKey(hashSet, key) {
    return hashSet.hasOwnProperty(key);
  }
}