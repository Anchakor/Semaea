import { VNode } from './External';

export interface IString {
  toString(): string
}
  
export interface IComponent {
  render(): VNode
}

/** Create a copy of `array`, setting item at index `ix` to `value`. */
export const arrayImmutableSet = <T>(array: Array<T>, ix: number, value: T): Array<T> => Object.assign([...array], {[ix]: value});

/** Create a new object which is combinations of properies of `a` and `b` (`b` overriding `a`) */
export const objectJoin = <A,B>(a: A, b: B): A & B => Object.assign({}, a, b);

/** Create a new object as a colne of `a` */
export const objectClone = <A>(a: A): A => Object.assign({}, a);
