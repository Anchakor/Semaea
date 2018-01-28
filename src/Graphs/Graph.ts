import { IDeserializeObject } from '../Serialization/IDeserializeObject';
import { deserialize } from '../Serialization/Serializer';
import { Triple } from '../Graphs/Triple';
import { GraphNode } from '../Graphs/GraphNode';
import { arrayClone } from 'Common';

export class Graph {
  protected _graph: Array<Triple>
  
  constructor() {
    this._graph = [];
  }

  static deserializeObject: IDeserializeObject<Graph> = (input: { _graph: Object[] }) => {
    const x = new Graph();
    input._graph.forEach(t => {
      x.addTriple(Triple.deserializeObject(t));
    });
    return x;
  }

  clone(): Graph {
    let clone = new Graph();
    clone._graph = arrayClone(this._graph);
    return clone;
  }
  
  count(): number {
    return this._graph.length;
  }
  
  get(s?: string, p?: string, o?: string) {
    return this._graph.filter(function (val, ix, array) {
      return !(typeof s == 'string' && val.s != s)
        && !(typeof p == 'string' && val.p != p)
        && !(typeof o == 'string' && val.o != o) 
    });
  }

  addTriple(triple: Triple) {
    this._graph.push(triple);
  }

  replaceNode(graphNode: GraphNode, replacement: string) {
    const node = graphNode.getValue();
    for (let i = 0; i < this._graph.length; i++) {
      if (this._graph[i].s == node) { this._graph[i].s = replacement; }
      if (this._graph[i].p == node) { this._graph[i].p = replacement; }
      if (this._graph[i].o == node) { this._graph[i].o = replacement; }
    }
    graphNode.setValue(replacement);
  }

  removeTriple(triple: Triple) {
    this._graph = this._graph.filter((value: Triple) => { return !value.equals(triple); });
  }

}
