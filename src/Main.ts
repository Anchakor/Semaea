import { plastiq, $ } from "External";
import { MainView } from "Views/MainView";
import { Triple } from "Graphs/Triple";
import { Graph } from "Graphs/Graph";
import { Model, ModelMeta } from "Model";
import * as GraphTests from "Graphs/GraphTests";

export function run() {
  const graph = new Graph();
  graph.addTriple(new Triple("testS", "testP", "testO"));
  graph.addTriple(new Triple("testS", "testP2", "testO"));
  graph.addTriple(new Triple("testO", "testP3", "testO3"));

  const testModelMeta = new ModelMeta();
  const model1 = new Model(graph);

  plastiq.append($('#plastiq'), (model: Model) => { return MainView.render(model); }, model1);
  
  setInterval(() => { $('#graph').textContent = JSON.stringify(model1); }, 1000);

  GraphTests.run();
}