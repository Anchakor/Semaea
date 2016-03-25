class Graph {
    constructor() {
        this._graph = [];
    }

    addTriple(triple) {
        this._graph.push(triple);
    }

    static makeTriple(s, p, o) {
        return {s: s, p: p, o: o};
    }

    replaceNode(graphNode, replacement) {
        var node = graphNode.getValue();
        this._graph = this._graph.map(function (triple2) {
            return { s: (triple2.s == node) ? replacement : triple2.s,
                p: (triple2.p == node) ? replacement : triple2.p,
                o: (triple2.o == node) ? replacement : triple2.o };
        });
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
