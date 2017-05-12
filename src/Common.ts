import { VNode } from './External';

export interface IString {
  toString(): string
}
  
export interface IComponent {
  render(): VNode
}

export const arrayImmutableSet = <T>(arr: Array<T>, ix: number, value: T): Array<T> => Object.assign([...arr], {[ix]: value});

export const objectJoin = <A,B>(a: A, b: B): A & B => Object.assign({}, a, b);
export const objectClone = <A>(a: A): A => Object.assign({}, a);
