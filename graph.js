class Graph {
    constructor() {
        this._graph = [];
    }
    
    count() {
        return this._graph.length;
    }
    
    get(s, p, o) {
        return this._graph.filter(function (val, ix, array) {
            return !(typeof s == "string" && val.s != s)
                && !(typeof p == "string" && val.p != p)
                && !(typeof o == "string" && val.o != o) 
        });
    }

    addTriple(triple) {
        this._graph.push(triple);
    }

    static makeTriple(s, p, o) {
        return {s: s, p: p, o: o};
    }

    replaceNode(graphNode, replacement) {
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
    constructor(triple, position) {
        this.triple = triple;
        this.position = position;
    }
    
    getValue() {
        if (!this.triple || !this.position) {
            return null;
        }
        return this.triple[this.position];
    }
    
    setValue(value) {
        this.triple[this.position] = value;
    }
}
