import { VNode } from 'plastiq';

export interface IString {
  toString(): string
}
  
export interface IComponent {
  render(): VNode
}