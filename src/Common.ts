import { VNode } from "../typings/plastiq.d";

export interface IString {
  toString(): string
}
  
export interface IComponent {
  render(): VNode
}

export interface IConstructable<T> {
  new (): T;
}