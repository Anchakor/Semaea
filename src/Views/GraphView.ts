import { h } from '../External';
import * as EntityView from '../Views/EntityView';
import { Model } from '../Model';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';


export function render(model: Model) {
  return renderLevel(model, 0);
}

function renderLevel(model: Model, depth: number) {
  return h('div', {}, model.graph.get().map((triple: Triple) => {
    return h('div', {}, [
      renderLevelPosition(model, new GraphNode(triple, 's')), ' ',
      renderLevelPosition(model, new GraphNode(triple, 'p')), ' ',
      renderLevelPosition(model, new GraphNode(triple, 'o'))
      ]);
  }));
}

function renderLevelPosition(model: Model, graphNode: GraphNode) {
  return EntityView.render(model, graphNode);   
}
