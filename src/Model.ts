import { IComponent } from "Common";
import { GraphNode } from "Graphs/GraphNode";
import { Graph } from "Graphs/Graph";

export class Model {
  refresh: () => void
  elemIdToFocus: string
  graph: Graph = null
  meta: ModelMeta = new ModelMeta()
  modals: Array<IComponent> = []
  
  constructor(graph: Graph) {
    this.graph = graph;
  }
}

export class ModelMeta {
  currentNode: GraphNode = null
  previousNode: GraphNode = null
  previousNodeNonPredicate: GraphNode = null
  previousNodePredicate: GraphNode = null
}