import { StoreLib } from '../External';
import { Graph } from '../Graphs/Graph';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { arrayImmutableSet } from "Common";

export interface State {
  graphs: {
    graph: Graph
    meta: {
      currentNode?: GraphNode
      previousNode?: GraphNode
      previousNodeNonPredicate?: GraphNode
      previousNodePredicate?: GraphNode
    }
  }[]
  currentGraph: number
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
  currentGraph: 0
};
defaultState = initializeTestGraph(defaultState);

// Actions:

export const InitializeTestGraphActionTypeConst = 'InitializeTestGraphAction';
export type InitializeTestGraphActionType = 'InitializeTestGraphAction';
export interface InitializeTestGraphAction extends StoreLib.Action { type: InitializeTestGraphActionType
}
const createInitializeTestGraphAction = () => ({ type: InitializeTestGraphActionTypeConst } as InitializeTestGraphAction);
function initializeTestGraph(state: State) {
  const graph = new Graph();
  graph.addTriple(new Triple('testS', 'testP', 'testO'));
  graph.addTriple(new Triple('testS', 'testP2', 'testO'));
  graph.addTriple(new Triple('testO', 'testP3', 'testO3'));
  return Object.assign({}, state, { graphs: arrayImmutableSet(state.graphs, 0, { graph: graph, meta: state.graphs[0].meta }) });
}

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case InitializeTestGraphActionTypeConst:
      return initializeTestGraph(state);
    default:
      return state;
  }
}
