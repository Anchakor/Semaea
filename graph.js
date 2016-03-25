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

    replaceNode(triple, position, replacement) {
        var node = triple[position];
        this._graph = this._graph.map(function (triple2) {
            return { s: (triple2.s == node) ? replacement : triple2.s,
                p: (triple2.p == node) ? replacement : triple2.p,
                o: (triple2.o == node) ? replacement : triple2.o };
        });
        triple[position] = replacement;
    }
}
