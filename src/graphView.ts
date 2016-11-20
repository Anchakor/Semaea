import { h } from "./external";
import * as EntityView from "./entityView";
import { Model } from "./model";
import { GraphNode } from "./graphs/graphNode";
import { Triple } from "./graphs/triple";


export function render(model: Model) {
  return renderLevel(model, 0);
}

function renderLevel(model: Model, depth: number) {
  return h('div', model.graph.get().map((triple: Triple) => {
    return h('div',
      renderLevelPosition(model, new GraphNode(triple, 's')), ' ',
      renderLevelPosition(model, new GraphNode(triple, 'p')), ' ',
      renderLevelPosition(model, new GraphNode(triple, 'o'))
      );
  }));
}

function renderLevelPosition(model: Model, graphNode: GraphNode) {
  return EntityView.render(model, graphNode);   
}
