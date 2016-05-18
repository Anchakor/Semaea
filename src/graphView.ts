namespace GraphView {
  export function render(model: Model) {
    return renderLevel(model, 0);
  }
  
  function renderLevel(model: Model, depth) {
    return h('div', model.graph.get().map((triple: Triple) => {
      return h('div',
        renderLevelPosition(model, new GraphNode(triple, 's')), ' ',
        renderLevelPosition(model, new GraphNode(triple, 'p')), ' ',
        renderLevelPosition(model, new GraphNode(triple, 'o'))
        );
    }));
  }
  
  function renderLevelPosition(model, graphNode) {
    return EntityView.render(model, graphNode);   
  }

  function renderLevelPositionSimple(entity, componentContainerDict) {
    return h('div', entity);
  }
  
  export function changeCurrentNode(model: Model, graphNode: GraphNode) {
    if (!graphNode) { return; }
    if (model.meta.currentNode) {
      if (model.meta.currentNode.getValue() != graphNode.getValue()) {
        model.meta.previousNode = model.meta.currentNode;
        if (model.meta.previousNode.position != 'p') {
          model.meta.previousNodeNonPredicate = model.meta.previousNode
        } else {
          model.meta.previousNodePredicate = model.meta.previousNode
        }
      }
    }
    model.meta.currentNode = graphNode;
  }
}