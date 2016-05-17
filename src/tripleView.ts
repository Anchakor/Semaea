class TripleView {
  static render(model: Model) {
    return TripleView.renderLevel(model, 0);
  }
  
  static renderLevel(model: Model, depth) {
    return h('div', model.graph.get().map((triple: Triple) => {
      return h('div',
        TripleView.renderLevelPosition(model, new GraphNode(triple, 's')), ' ',
        TripleView.renderLevelPosition(model, new GraphNode(triple, 'p')), ' ',
        TripleView.renderLevelPosition(model, new GraphNode(triple, 'o'))
        );
    }));
  }
  
  static renderLevelPosition(model, graphNode) {
    return EntityController.render(model, graphNode);   
  }

  static renderLevelPositionSimple(entity, componentContainerDict) {
    return h('div', entity);
  }
}