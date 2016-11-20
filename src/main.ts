import { plastiq, $ } from "./external";
import * as MainView from "./mainView";
import { Triple } from "./graphs/triple";
import { Graph } from "./graphs/graph";
import { Model, ModelMeta } from "./model";

const graph = new Graph();
graph.addTriple(new Triple("testS", "testP", "testO"));
graph.addTriple(new Triple("testS", "testP2", "testO"));
graph.addTriple(new Triple("testO", "testP3", "testO3"));

const testModelMeta = new ModelMeta();
const model1 = new Model(graph);

window.onload = function () {
  plastiq.append($('#plastiq'), (model: Model) => { return MainView.render(model); }, model1);
  
  setInterval(() => { $('#graph').textContent = JSON.stringify(model1); }, 1000);
}