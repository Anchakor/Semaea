import { VNode, StoreLib } from './External';

export interface IString {
  toString(): string
}
  
export interface IComponent {
  render(): VNode
}

/** Create a copy of `array`, setting item at index `ix` to `value`. */
export const arrayImmutableSet = <T>(array: Array<T>, ix: number, value: T): Array<T> => Object.assign([...array], {[ix]: value});

/** Create a copy of `array`, appending item `value` to it. */
export const arrayImmutableAppend = <T>(array: Array<T>, value: T): Array<T> => Object.assign([...array], {[array.length]: value});

/** Create a new array as a clone of `a` */
export const arrayClone = <A>(a: Array<A>): Array<A> => a.slice(0);

/** Create a new object which is combinations of properies of `a` and `b` (`b` overriding `a`) */
export const objectJoin = <A>(a: A, b: Partial<A>): A => Object.assign({}, a, b);
export const objectJoinExtend = <A,B>(a: A, b: B): A & B => Object.assign({}, a, b);

/** Create a new object as a clone of `a` */
export const objectClone = <A>(a: A): A => Object.assign({}, a);

export const assert = (test: boolean, message: string) => {
  if (!test) {
    console.error(message);
  }
}

export const Log = {
  debug: console.debug,
  error: console.error,
  log: console.log
}


interface ObjectWithKind<T extends string> { readonly kind: T; }

type TypeOfKind<T extends ObjectWithKind<any>, TKind extends T['kind']> =
    T extends { readonly kind: TKind } ? T : never;

/** Create a type-guard for a group of objects with `kind` string property (can be string enum!). `T` has to be type union of the object types. */
export function checkKindFor<T extends ObjectWithKind<any>>() {
  return <TKind extends T['kind']>(kind: TKind) =>
    (value: T): value is TypeOfKind<T, TKind> =>
      value.kind === kind;
}

/** Filter an array narrowing the type by a typeguard */
export function filterDownArray<T, U extends T>(array: T[], predicate: (x: T) => x is U): U[] {
  return array.filter(predicate);
}