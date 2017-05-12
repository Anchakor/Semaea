import { arrayImmutableSet, objectClone, objectJoin } from '../Common';
import { StoreLib } from '../External';
import { Graph } from '../Graphs/Graph';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';

export interface GraphMeta {
  currentNode?: GraphNode
  previousNode?: GraphNode
  previousNodeNonPredicate?: GraphNode
  previousNodePredicate?: GraphNode
}

export interface State {
  graphs: {
    graph: Graph
    meta: GraphMeta
  }[]
  currentGraphIndex: number
}
export let defaultState: State = { 
  graphs: [{ 
    graph: new Graph(),
    meta: {
      currentNode: undefined,
      previousNode: undefined,
      previousNodeNonPredicate: undefined,
      previousNodePredicate: undefined
    }
  }],
  currentGraphIndex: 0
};
defaultState = initializeTestGraph(defaultState);

// Actions:

export const InitializeTestGraphActionTypeConst = 'InitializeTestGraphAction';
export type InitializeTestGraphActionType = 'InitializeTestGraphAction';
export interface InitializeTestGraphAction extends StoreLib.Action { type: InitializeTestGraphActionType
}
export const createInitializeTestGraphAction = () => ({ type: InitializeTestGraphActionTypeConst } as InitializeTestGraphAction);
function initializeTestGraph(state: State) {
  const graph = new Graph();
  graph.addTriple(new Triple('testS', 'testP', 'testO'));
  graph.addTriple(new Triple('testS', 'testP2', 'testO'));
  graph.addTriple(new Triple('testO', 'testP3', 'testO3'));
  return objectJoin(state, { graphs: arrayImmutableSet(state.graphs, 0, { graph: graph, meta: state.graphs[0].meta }) });
}

export const ChangeCurrentNodeActionTypeConst = 'ChangeCurrentNodeAction';
export type ChangeCurrentNodeActionType = 'ChangeCurrentNodeAction';
export interface ChangeCurrentNodeAction extends StoreLib.Action { type: ChangeCurrentNodeActionType
  graphIndex: number
  graphNode: GraphNode
}
export const createChangeCurrentNodeAction = (graphIndex: number, graphNode: GraphNode) => 
  ({ type: ChangeCurrentNodeActionTypeConst, graphIndex: graphIndex, graphNode: graphNode } as ChangeCurrentNodeAction);
function createChangeCurrentNode(state: State, action: ChangeCurrentNodeAction){
  const currentGraph = state.graphs[action.graphIndex];
  const newMeta = objectClone(currentGraph.meta);
  if (currentGraph.meta.currentNode) {
    if (currentGraph.meta.currentNode.getValue() != action.graphNode.getValue()) {
      newMeta.previousNode = currentGraph.meta.currentNode;
      if (newMeta.previousNode.position != 'p') {
        newMeta.previousNodeNonPredicate = newMeta.previousNode
      } else {
        newMeta.previousNodePredicate = newMeta.previousNode
      }
    }
  }
  newMeta.currentNode = action.graphNode;
  return objectJoin(state, { 
    graphs: arrayImmutableSet(state.graphs, action.graphIndex, 
      objectJoin(currentGraph, { meta: newMeta })
    )
  });
}


// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case InitializeTestGraphActionTypeConst:
      return initializeTestGraph(state);
    case ChangeCurrentNodeActionTypeConst:
      return createChangeCurrentNode(state, action as ChangeCurrentNodeAction);
    default:
      return state;
  }
}
