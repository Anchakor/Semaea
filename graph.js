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

    replaceNode(node, replacement) {
        this._graph = this._graph.map(function (triple) {
            return { s: (triple.s == node) ? replacement : triple.s,
                p: (triple.p == node) ? replacement : triple.p,
                o: (triple.o == node) ? replacement : triple.o };
        });
    }
}
