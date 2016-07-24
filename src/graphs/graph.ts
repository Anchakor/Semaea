namespace Graphs {
  export class Graph {
    protected _graph: Array<Triple>
    
    constructor() {
      this._graph = [];
    }
    
    count(): number {
      return this._graph.length;
    }
    
    get(s: string = null, p: string = null, o: string = null) {
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
  }
}
