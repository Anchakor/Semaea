class Model {
  refresh: () => void
  elemIdToFocus: string
  graph: Graphs.Graph = null
  meta: ModelMeta = new ModelMeta()
  modals: Array<IComponent> = []
  
  constructor(graph: Graphs.Graph) {
    this.graph = graph;
  }
}

class ModelMeta {
  currentNode: Graphs.GraphNode = null
  previousNode: Graphs.GraphNode = null
  previousNodeNonPredicate: Graphs.GraphNode = null
  previousNodePredicate: Graphs.GraphNode = null
}