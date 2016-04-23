testlib.test("Triple", function(assert) {
    var triple = Graph.makeTriple("s", "p", "o");
    assert.strictEqual(triple.s, "s");
    assert.strictEqual(triple.p, "p");
    assert.strictEqual(triple.o, "o");
});

var setupTestGraph = function () {
    var g = new Graph();
    var triple = Graph.makeTriple("s", "p", "o");
    var triple2 = Graph.makeTriple("s", "p", "o2");
    var triple3 = Graph.makeTriple("s", "p3", "o3");
    var triple4 = Graph.makeTriple("s4", "p4", "o4");
    g.addTriple(triple);
    g.addTriple(triple2);
    g.addTriple(triple3);
    g.addTriple(triple4);
    
    return g;
}

testlib.test("Graph", function(assert) {
    var g = setupTestGraph();
    assert.strictEqual(g.count(), 4);
        
    assert.strictEqual(g.get().length, 4);
    assert.strictEqual(g.get("s").length, 3);
    assert.strictEqual(g.get("s4").length, 1);
    assert.strictEqual(g.get(null, "p").length, 2);
    assert.strictEqual(g.get(null, null, "o4").length, 1);
    assert.strictEqual(g.get("s", null, "o3").length, 1);
    assert.strictEqual(g.get(null, null, "o4")[0].s, "s4");
    assert.strictEqual(g.get(null, null, "o4")[0].p, "p4");
    assert.strictEqual(g.get(null, null, "o4")[0].o, "o4");
    assert.strictEqual(g.get("s", null, "o3")[0].p, "p3");   
});

testlib.test("GraphNode", function(assert) {   
    var g = setupTestGraph();
    var gn = new GraphNode(Graph.makeTriple("sx", "px", "ox"), "o");
    assert.strictEqual(gn.getValue(), "ox");
    
    assert.strictEqual(gn.toString(), "o$sx|px|ox");
    
    gn.setValue("ox2");
    assert.strictEqual(gn.getValue(), "ox2");
    
    var gn2 = new GraphNode(Graph.makeTriple("s4", "p4", "o4"), "o");
    g.replaceNode(gn2, "o4b");
    assert.strictEqual(gn2.getValue(), "o4b");
    assert.strictEqual(g.get("s4", "p4")[0].o, "o4b");
    
    var gn2b = new GraphNode(Graph.makeTriple("s4", "p4", "o4b"), "o");
    g.replaceNode(gn2b, "o4bb");
    assert.strictEqual(gn2b.getValue(), "o4bb");
    assert.strictEqual(g.get("s4", "p4")[0].o, "o4bb");
    
    var gn3 = new GraphNode(g.get("s", "p3")[0], "o");
    g.replaceNode(gn3, "o3b");
    assert.strictEqual(gn3.getValue(), "o3b");
    assert.strictEqual(g.get("s", "p3")[0].o, "o3b");
    
    var gn4 = new GraphNode(g.get("s", "p3")[0], "o");
    g.replaceNode(gn4, "o3bb");
    assert.strictEqual(gn4.getValue(), "o3bb");
    assert.strictEqual(g.get("s", "p3")[0].o, "o3bb");
});