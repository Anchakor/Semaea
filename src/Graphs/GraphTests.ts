import * as Test from '../Test';
import { Triple } from '../Graphs/Triple';
import { Graph } from '../Graphs/Graph';
import { GraphNode } from '../Graphs/GraphNode';
import * as Serializer from '../Serialization/Serializer';

export function runGraphTests() {

  Test.test('Triple', function(assert) {
    const triple = new Triple('s', 'p', 'o');
    assert.strictEqual(triple.s, 's');
    assert.strictEqual(triple.p, 'p');
    assert.strictEqual(triple.o, 'o');

    assert.strictEqual(triple.getNodeAtPosition('s'), 's');
    assert.strictEqual(triple.getNodeAtPosition('p'), 'p');
    assert.strictEqual(triple.getNodeAtPosition('o'), 'o');

    assert.strictEqual(triple.toString(), 's p o');
    
    triple.setNodeAtPosition('s', 's2');
    triple.setNodeAtPosition('p', 'p2');
    triple.setNodeAtPosition('o', 'o2');
    assert.strictEqual(triple.toString(), 's2 p2 o2');

    const triple2 = new Triple('s2', 'p2', 'o2');
    const triple3 = new Triple('s', 'p', 'o');
    assert.strictEqual(triple.equals(triple2), true);
    assert.strictEqual(triple.equals(triple3), false);
    assert.strictEqual(triple2.equals(triple3), false);
  });

  const setupTestGraph = function () {
    const g = new Graph();
    const triple = new Triple('s', 'p', 'o');
    const triple2 = new Triple('s', 'p', 'o2');
    const triple3 = new Triple('s', 'p3', 'o3');
    const triple4 = new Triple('s4', 'p4', 'o4');
    g.addTriple(triple);
    g.addTriple(triple2);
    g.addTriple(triple3);
    g.addTriple(triple4);
    
    return g;
  }

  Test.test('Graph', function(assert) {
    const g = setupTestGraph();
    assert.strictEqual(g.count(), 4);
      
    assert.strictEqual(g.get().length, 4);
    assert.strictEqual(g.get('s').length, 3);
    assert.strictEqual(g.get('s4').length, 1);
    assert.strictEqual(g.get(undefined, 'p').length, 2);
    assert.strictEqual(g.get(undefined, undefined, 'o4').length, 1);
    assert.strictEqual(g.get('s', undefined, 'o3').length, 1);
    assert.strictEqual(g.get(undefined, undefined, 'o4')[0].s, 's4');
    assert.strictEqual(g.get(undefined, undefined, 'o4')[0].p, 'p4');
    assert.strictEqual(g.get(undefined, undefined, 'o4')[0].o, 'o4');
    assert.strictEqual(g.get('s', undefined, 'o3')[0].p, 'p3');

    g.removeTriple(new Triple('s4', 'p4', 'o4'));
    assert.strictEqual(g.get('s4').length, 0);
    assert.strictEqual(g.get(undefined, 'p4').length, 0);
    assert.strictEqual(g.get(undefined, undefined, 'o4').length, 0);
  });

  Test.test('GraphNode', function(assert) {   
    const g = setupTestGraph();
    const gn = new GraphNode(new Triple('sx', 'px', 'ox'), 'o');
    assert.strictEqual(gn.getValue(), 'ox');
    
    assert.strictEqual(gn.toString(), 'o$sx|px|ox');
    
    gn.setValue('ox2');
    assert.strictEqual(gn.getValue(), 'ox2');
    
    const gn2 = new GraphNode(new Triple('s4', 'p4', 'o4'), 'o');
    g.replaceNode(gn2, 'o4b');
    assert.strictEqual(gn2.getValue(), 'o4b');
    assert.strictEqual(g.get('s4', 'p4')[0].o, 'o4b');
    
    const gn2b = new GraphNode(new Triple('s4', 'p4', 'o4b'), 'o');
    g.replaceNode(gn2b, 'o4bb');
    assert.strictEqual(gn2b.getValue(), 'o4bb');
    assert.strictEqual(g.get('s4', 'p4')[0].o, 'o4bb');
    
    const gn3 = new GraphNode(g.get('s', 'p3')[0], 'o');
    g.replaceNode(gn3, 'o3b');
    assert.strictEqual(gn3.getValue(), 'o3b');
    assert.strictEqual(g.get('s', 'p3')[0].o, 'o3b');
    
    const gn4 = new GraphNode(g.get('s', 'p3')[0], 'o');
    g.replaceNode(gn4, 'o3bb');
    assert.strictEqual(gn4.getValue(), 'o3bb');
    assert.strictEqual(g.get('s', 'p3')[0].o, 'o3bb');
  });
  
  Test.test('Serializer', function(assert) {
    const g = setupTestGraph();
    const gs = Serializer.serialize(g);
    const g2 = Serializer.deserialize(Graph.deserializeObject, gs);
    assert.ok(g2, 'Graph ran through serialization and deserialization is truthy.');
    if (g2) {
      assert.serializedEqual(g.get(), g2.get(), 'Graph ran through serialization and deserialization matches the original graph.');
    }
  })
}
