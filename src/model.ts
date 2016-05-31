class Model {
  refresh: () => void
  elemIdToFocus: string
  graph: Graph = null
  meta: ModelMeta = new ModelMeta()
  modals: Array<IComponent> = []
  
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
  
interface IComponent {
  render: (IComponent) => Plastiq.VNode
  [others: string]: any
}