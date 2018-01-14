import { arrayImmutableSet, objectClone, objectJoin } from '../Common';
import { StoreLib, UILib, UIStoreLib } from '../External';
import { Graph } from '../Graphs/Graph';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';

/* Graphs and SaGraphViews
Graphs are the data being displayed in Semaea in one SaGraphView.
SaGraphView has the information about how is a Graph being displayed by Semaea.
SaGraphViews 0..* - 1 Graph
SaGraphViews 0..1 - 0..* SaViews
*/

export interface SaGraphView {
  graphIndex: number
  currentNode?: GraphNode
  previousNode?: GraphNode
  previousNodeNonPredicate?: GraphNode
  previousNodePredicate?: GraphNode
}

export interface State {
  graphs: Graph[]
  saGraphViews: SaGraphView[]
}
export let defaultState: State = { 
  graphs: [new Graph()],
  saGraphViews: [{ 
    graphIndex: 0,
    currentNode: undefined,
    previousNode: undefined,
    previousNodeNonPredicate: undefined,
    previousNodePredicate: undefined
  }],
};
defaultState = doInitializeTestGraphAction(defaultState);

// Actions:

export enum ActionType { InitializeTestGraph = 'InitializeTestGraph' }
export interface InitializeTestGraphAction extends StoreLib.Action { type: ActionType.InitializeTestGraph
}
export const createInitializeTestGraphAction = ():InitializeTestGraphAction => ({ type: ActionType.InitializeTestGraph });
function doInitializeTestGraphAction(state: State): State {
  const graph = new Graph();
  graph.addTriple(new Triple('testS', 'testP', 'testO'));
  graph.addTriple(new Triple('testS', 'testP2', 'testO'));
  graph.addTriple(new Triple('testO', 'testP3', 'testO3'));

  const graph2 = new Graph();
  graph2.addTriple(new Triple('testS', 'testP', 'testO'));

  const newGraphs = [ graph, graph2 ];
  const newViews = [
    objectClone(defaultState.saGraphViews[0]),
    objectJoin(defaultState.saGraphViews[0], { graphIndex: 1 })
    ];

  return objectJoin(state, { graphs: newGraphs, saGraphViews: newViews });
}

export enum ActionType { ChangeSaGraphViewGraph = 'ChangeSaGraphViewGraph' }
export interface ChangeSaGraphViewGraphAction extends StoreLib.Action { type: ActionType.ChangeSaGraphViewGraph
  saGraphViewIndex: number
  graphIndex: number
}
export const createChangeSaGraphViewGraphAction = (saGraphViewIndex: number, graphIndex: number): ChangeSaGraphViewGraphAction => 
  ({ type: ActionType.ChangeSaGraphViewGraph, saGraphViewIndex: saGraphViewIndex, graphIndex: graphIndex });
function doChangeSaGraphViewGraphAction(state: State, action: ChangeSaGraphViewGraphAction): State {
  return objectJoin(state, { 
    saGraphViews: arrayImmutableSet(state.saGraphViews, action.saGraphViewIndex, 
      objectJoin(state.saGraphViews[action.saGraphViewIndex], { graphIndex: action.graphIndex })
    )});
}

export enum ActionType { ChangeCurrentNode = 'ChangeCurrentNode' }
export interface ChangeCurrentNodeAction extends StoreLib.Action { type: ActionType.ChangeCurrentNode
  saViewGraphIndex: number
  graphNode: GraphNode
}
export const createChangeCurrentNodeAction = (saViewGraphIndex: number, graphNode: GraphNode): ChangeCurrentNodeAction => 
  ({ type: ActionType.ChangeCurrentNode, saViewGraphIndex: saViewGraphIndex, graphNode: graphNode });
function doChangeCurrentNodeAction(state: State, action: ChangeCurrentNodeAction): State {
  const saViewGraph = state.saGraphViews[action.saViewGraphIndex];
  const newSaViewGraph = objectClone(saViewGraph);
  if (saViewGraph.currentNode) {
    if (saViewGraph.currentNode.getValue() != action.graphNode.getValue()) {
      newSaViewGraph.previousNode = saViewGraph.currentNode;
      if (newSaViewGraph.previousNode.position != 'p') {
        newSaViewGraph.previousNodeNonPredicate = newSaViewGraph.previousNode
      } else {
        newSaViewGraph.previousNodePredicate = newSaViewGraph.previousNode
      }
    }
  }
  newSaViewGraph.currentNode = action.graphNode;
  return objectJoin(state, { 
    saGraphViews: arrayImmutableSet(state.saGraphViews, action.saViewGraphIndex, newSaViewGraph)
  });
}


// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.InitializeTestGraph:
      return doInitializeTestGraphAction(state);
    case ActionType.ChangeSaGraphViewGraph:
      return doChangeSaGraphViewGraphAction(state, action as ChangeSaGraphViewGraphAction);
    case ActionType.ChangeCurrentNode:
      return doChangeCurrentNodeAction(state, action as ChangeCurrentNodeAction);
    default:
      return state;
  }
}
