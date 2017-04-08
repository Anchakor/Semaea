import { IComponent } from "Common";
import { GraphNode } from "Graphs/GraphNode";
import { Graph } from "Graphs/Graph";

export class Model {
  refresh: () => void
  elemIdToFocus: string
  graph: Graph = new Graph()
  meta: ModelMeta = new ModelMeta()
  modals: Array<IComponent> = []
  
  constructor(graph: Graph) {
    this.graph = graph;
  }
}



export class ModelMeta {
  currentNode: GraphNode | null = null
  previousNode: GraphNode | null = null
  previousNodeNonPredicate: GraphNode | null = null
  previousNodePredicate: GraphNode | null = null
}