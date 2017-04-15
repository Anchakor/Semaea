import { Triple } from "Graphs/Triple";
import { GraphNode } from "Graphs/GraphNode";
import { ISerializable } from "Serialization/ISerializable";

export class Graph implements ISerializable<Graph> {
  protected _graph: Array<Triple>
  
  constructor() {
    this._graph = [];
  }
  
  count(): number {
    return this._graph.length;
  }
  
  get(s?: string, p?: string, o?: string) {
    return this._graph.filter(function (val, ix, array) {
      return !(typeof s == "string" && val.s != s)
        && !(typeof p == "string" && val.p != p)
        && !(typeof o == "string" && val.o != o) 
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

  deserializeObject(input: { _graph: {s: string, p: string, o: string}[] }): void {
    this._graph = [];
    input._graph.forEach(t => {
      this.addTriple(new Triple(t.s, t.p, t.o));
    });
  }

}
