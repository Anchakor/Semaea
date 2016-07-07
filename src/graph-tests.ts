
testlib.test("Triple", function(assert) {
  const triple = new Triple("s", "p", "o");
  assert.strictEqual(triple.s, "s");
  assert.strictEqual(triple.p, "p");
  assert.strictEqual(triple.o, "o");
});

const setupTestGraph = function () {
  const g = new Graph();
  const triple = new Triple("s", "p", "o");
  const triple2 = new Triple("s", "p", "o2");
  const triple3 = new Triple("s", "p3", "o3");
  const triple4 = new Triple("s4", "p4", "o4");
  g.addTriple(triple);
  g.addTriple(triple2);
  g.addTriple(triple3);
  g.addTriple(triple4);
  
  return g;
}

testlib.test("Graph", function(assert) {
  const g = setupTestGraph();
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
  const g = setupTestGraph();
  const gn = new GraphNode(new Triple("sx", "px", "ox"), "o");
  assert.strictEqual(gn.getValue(), "ox");
  
  assert.strictEqual(gn.toString(), "o$sx|px|ox");
  
  gn.setValue("ox2");
  assert.strictEqual(gn.getValue(), "ox2");
  
  const gn2 = new GraphNode(new Triple("s4", "p4", "o4"), "o");
  g.replaceNode(gn2, "o4b");
  assert.strictEqual(gn2.getValue(), "o4b");
  assert.strictEqual(g.get("s4", "p4")[0].o, "o4b");
  
  const gn2b = new GraphNode(new Triple("s4", "p4", "o4b"), "o");
  g.replaceNode(gn2b, "o4bb");
  assert.strictEqual(gn2b.getValue(), "o4bb");
  assert.strictEqual(g.get("s4", "p4")[0].o, "o4bb");
  
  const gn3 = new GraphNode(g.get("s", "p3")[0], "o");
  g.replaceNode(gn3, "o3b");
  assert.strictEqual(gn3.getValue(), "o3b");
  assert.strictEqual(g.get("s", "p3")[0].o, "o3b");
  
  const gn4 = new GraphNode(g.get("s", "p3")[0], "o");
  g.replaceNode(gn4, "o3bb");
  assert.strictEqual(gn4.getValue(), "o3bb");
  assert.strictEqual(g.get("s", "p3")[0].o, "o3bb");
});