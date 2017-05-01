import { VNode } from './External';

export interface IString {
  toString(): string
}
  
export interface IComponent {
  render(): VNode
}