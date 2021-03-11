import { IDeserializeObject } from '../Serialization/IDeserializeObject';
import { immerable } from 'immer';

export type TriplePosition = 's' | 'p' | 'o';

export class Triple {
  [immerable] = true

  s: string
  p: string
  o: string
  
  constructor(s: string, p: string, o: string) {
    this.s = s;
    this.p = p;
    this.o = o;
  }

  static deserializeObject: IDeserializeObject<Triple> = (input: {s: string, p: string, o: string}) => {
    return new Triple(input.s, input.p, input.o);
  }

  equals(other: Triple): boolean {
    return (this.s == other.s && this.p == other.p && this.o == other.o);
  }

  getNodeAtPosition(position: TriplePosition): string {
    if (position == 's') return this.s;
    if (position == 'p') return this.p;
    if (position == 'o') return this.o;
    return '';
  }

  setNodeAtPosition(position: TriplePosition, value: string) {
    if (position == 's') this.s = value;
    if (position == 'p') this.p = value;
    if (position == 'o') this.o = value;
  }

  toString(): string {
    return this.s+' '+this.p+' '+this.o;
  }
}
