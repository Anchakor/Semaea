class GraphView {
  static changeCurrentNode(model: Model, graphNode: GraphNode) {
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