import { Triple, TriplePosition } from '../Graphs/Triple';

export class GraphNode {
  protected _triple: Triple
  protected _position: TriplePosition
  
  public get position() : TriplePosition {
    return this._position;
  }
  
  constructor(triple: Triple, position: TriplePosition) {
    this._triple = triple;
    this._position = position;
  }
  
  getValue(): string {
    return this._triple.getNodeAtPosition(this._position);
  }
  
  setValue(value: string) {
    this._triple.setNodeAtPosition(this._position, value);
  }

  getTriple(): Triple {
    return this._triple;
  }
  
  toString(): string {
    return this._position + '$' + this._triple.s + '|' + this._triple.p + '|' + this._triple.o;
  }

  equals(graphNode: GraphNode): boolean {
    return this.position == graphNode.position
      && this._triple.s == graphNode._triple.s
      && this._triple.p == graphNode._triple.p
      && this._triple.o == graphNode._triple.o;
  }
}
