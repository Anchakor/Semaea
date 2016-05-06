class Triple {
  s: string
  p: string
  o: string
  
  constructor(s: string, p: string, o: string) {
    this.s = s;
    this.p = p;
    this.o = o;
  }
}

class Graph {
  protected _graph: Array<Triple>
  
  constructor() {
    this._graph = [];
  }
  
  count(): number {
    return this._graph.length;
  }
  
  get(s: string, p: string, o: string) {
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
    var node = graphNode.getValue();
    for (var i = 0; i < this._graph.length; i++) {
      if (this._graph[i].s == node) { this._graph[i].s = replacement; }
      if (this._graph[i].p == node) { this._graph[i].p = replacement; }
      if (this._graph[i].o == node) { this._graph[i].o = replacement; }
    }
    graphNode.setValue(replacement);
  }
}

class GraphNode {
  protected triple: Triple
  protected position: string
  
  constructor(triple: Triple, position: string) {
    this.triple = triple;
    this.position = position;
  }
  
  getValue(): string {
    if (!this.triple || !this.position) {
      return null;
    }
    return this.triple[this.position];
  }
  
  setValue(value: string) {
    this.triple[this.position] = value;
  }
  
  toString(): string {
    return this.position + '$' + this.triple.s + '|' + this.triple.p + '|' + this.triple.o;
  }
}
