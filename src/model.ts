class Model {
  refresh: () => void
  elemIdToFocus: string
  graph: Graph = null
  meta: ModelMeta = new ModelMeta()
  modals: Array<any> = []
  
  constructor(graph: Graph) {
    this.graph = graph;
  }
}

class ModelMeta {
  currentNode: GraphNode = null
  previousNode: GraphNode = null
  previousNodeNonPredicate: GraphNode = null
  previousNodePredicate: GraphNode = null
}