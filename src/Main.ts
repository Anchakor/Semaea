import { inferno, $ } from './External';
import { MainView } from './Views/MainView';
import { Triple } from './Graphs/Triple';
import { Graph } from './Graphs/Graph';
import { Model, ModelMeta } from './Model';
import * as GraphTests from './Graphs/GraphTests';
import * as IntegrationTests from './Server/IntegrationTests';

export function run(attachPoint: HTMLElement) {
  const graph = new Graph();
  graph.addTriple(new Triple('testS', 'testP', 'testO'));
  graph.addTriple(new Triple('testS', 'testP2', 'testO'));
  graph.addTriple(new Triple('testO', 'testP3', 'testO3'));

  const testModelMeta = new ModelMeta();
  const model1 = new Model(graph);

  inferno.render(MainView.render(model1), attachPoint);
  
  setInterval(() => { $('#graph').textContent = JSON.stringify(model1); }, 1000);

  GraphTests.run();
  IntegrationTests.run();
}