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