class Triple {
  s: string
  p: string
  o: string
  
  constructor(s: string, p: string, o: string) {
    this.s = s;
    this.p = p;
    this.o = o;
  }

  equals(other: Triple): boolean {
    return (this.s == other.s && this.p == other.p && this.o == other.o);
  }

  getNodeAtPosition(position: string): string {
    if (position == 's') return this.s;
    if (position == 'p') return this.p;
    if (position == 'o') return this.o;
    return '';
  }

  setNodeAtPosition(position: string, value: string) {
    if (position == 's') this.s = value;
    if (position == 'p') this.p = value;
    if (position == 'o') this.o = value;
  }

  toString(): string {
    return this.s+' '+this.p+' '+this.o;
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

class GraphNode {
  protected _triple: Triple
  protected _position: string
  
  public get position() : string {
    return this._position;
  }
  
  constructor(triple: Triple, position: string) {
    this._triple = triple;
    this._position = position;
  }
  
  getValue(): string {
    if (!this._triple || !this._position) {
      return null;
    }
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
}
