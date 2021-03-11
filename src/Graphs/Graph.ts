import { IDeserializeObject } from '../Serialization/IDeserializeObject';
import { deserialize } from '../Serialization/Serializer';
import { Triple } from '../Graphs/Triple';
import { GraphNode } from '../Graphs/GraphNode';
import { arrayClone } from 'Common';
import { immerable } from 'immer';

export class Graph {
  [immerable] = true
  
  protected triples: Array<Triple>
  
  constructor() {
    this.triples = [];
  }

  static deserializeObject: IDeserializeObject<Graph> = (input: { triples: Object[] }) => {
    const x = new Graph();
    input.triples.forEach(t => {
      x.addTriple(Triple.deserializeObject(t));
    });
    return x;
  }

  clone(): Graph {
    let clone = new Graph();
    clone.triples = arrayClone(this.triples);
    return clone;
  }
  
  count(): number {
    return this.triples.length;
  }
  
  get(s?: string, p?: string, o?: string) {
    return this.triples.filter(function (val, ix, array) {
      return !(typeof s == 'string' && val.s != s)
        && !(typeof p == 'string' && val.p != p)
        && !(typeof o == 'string' && val.o != o) 
    });
  }

  addTriple(triple: Triple) {
    this.triples.push(triple);
  }

  replaceNode(graphNode: GraphNode, replacement: string) {
    const node = graphNode.getValue();
    for (let i = 0; i < this.triples.length; i++) {
      if (this.triples[i].s == node) { this.triples[i].s = replacement; }
      if (this.triples[i].p == node) { this.triples[i].p = replacement; }
      if (this.triples[i].o == node) { this.triples[i].o = replacement; }
    }
    graphNode.setValue(replacement);
  }

  removeTriple(triple: Triple) {
    this.triples = this.triples.filter((value: Triple) => { return !value.equals(triple); });
  }

  /**
   * Ideally not used. Note that there is getSaGraphViewFilteredTriples(saGraphView: SaGraphView, graph: Graph)
   */
  getTripleAtIndex(index: number): Triple | undefined {
    return (index >= 0 && index < this.triples.length)
      ? this.triples[index]
      : undefined;
  }

  merge(graph: Graph){
    this.triples = this.triples.concat(graph.triples);
  }
}
