import { arrayImmutableSet, objectClone, objectJoin } from '../Common';
import { StoreLib, UILib, UIStoreLib } from '../External';
import { Graph } from '../Graphs/Graph';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { SaView } from '../SaViews';

/* Graphs and SaGraphViews
Graphs are the data being displayed in Semaea in one SaGraphView.
SaGraphView has the information about how is a Graph being displayed by Semaea.
SaGraphViews 0..* - 1 Graph
SaGraphViews 0..1 - 0..* SaViews
*/

export interface SaGraphView {
  readonly graphIndex: number
  readonly currentNode?: GraphNode
  readonly previousNode?: GraphNode
  readonly previousNodeNonPredicate?: GraphNode
  readonly previousNodePredicate?: GraphNode
}

export interface State {
  readonly graphs: (Graph | undefined)[]
  readonly saGraphViews: SaGraphView[]
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

export function setCurrentNodeToFirstNode(saGraphView: SaGraphView, graphsState: State) {
  const graph = graphsState.graphs[saGraphView.graphIndex];
  if (!graph) return saGraphView;
  const triple = graph.getTripleAtIndex(0);
  if (!triple) return saGraphView;
  return objectJoin<SaGraphView>(saGraphView, { currentNode: new GraphNode(triple, "s") });
}

// Actions:

// InitializeTestGraphAction
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

// ChangeSaGraphViewGraphAction
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

// ChangeCurrentNodeAction
export enum ActionType { ChangeCurrentNode = 'ChangeCurrentNode' }
export interface ChangeCurrentNodeAction extends StoreLib.Action { type: ActionType.ChangeCurrentNode
  saGraphViewIndex: number
  graphNode: GraphNode
}
export const createChangeCurrentNodeAction = (saGraphViewIndex: number, graphNode: GraphNode): ChangeCurrentNodeAction => 
  ({ type: ActionType.ChangeCurrentNode, saGraphViewIndex: saGraphViewIndex, graphNode: graphNode });
function doChangeCurrentNodeAction(state: State, action: ChangeCurrentNodeAction): State {
  const saGraphView = state.saGraphViews[action.saGraphViewIndex];
  let previousNode, previousNodeNonPredicate, previousNodePredicate;
  if (saGraphView.currentNode) {
    if (saGraphView.currentNode.getValue() != action.graphNode.getValue()) {
      previousNode = saGraphView.currentNode;
      if (previousNode.position != 'p') {
        previousNodeNonPredicate = previousNode;
      } else {
        previousNodePredicate = previousNode;
      }
    }
  }
  const newSaGraphView = objectJoin(saGraphView, { 
    currentNode: action.graphNode, 
    previousNode: previousNode, 
    previousNodeNonPredicate: previousNodeNonPredicate,
    previousNodePredicate: previousNodePredicate
   });
  return objectJoin<State>(state, { 
    saGraphViews: arrayImmutableSet(state.saGraphViews, action.saGraphViewIndex, newSaGraphView)
  });
}

// AddTripleAction
export enum ActionType { AddTriple = 'AddTriple' }
export interface AddTripleAction extends StoreLib.Action { type: ActionType.AddTriple
  graphIndex: number
  triple: Triple
}
export const createAddTripleAction = (graphIndex: number, triple: Triple): AddTripleAction => 
  ({ type: ActionType.AddTriple, graphIndex: graphIndex, triple: triple });
export function doAddTripleAction(state: State, action: AddTripleAction) {
  const graph = state.graphs[action.graphIndex];
  if (!graph) return state;
  const newGraph = graph.clone();
  newGraph.addTriple(action.triple);
  const newGraphs = arrayImmutableSet(state.graphs, action.graphIndex, newGraph);
  return objectJoin<State>(state, { graphs: newGraphs });
}

// DeleteGraphAction
export enum ActionType { DeleteGraph = 'DeleteGraph' }
export interface DeleteGraphAction extends StoreLib.Action { type: ActionType.DeleteGraph
  graphIndex: number
}
export const createDeleteGraphAction = (graphIndex: number): DeleteGraphAction => 
  ({ type: ActionType.DeleteGraph, graphIndex: graphIndex });
function doDeleteGraphAction(state: State, action: DeleteGraphAction) {
  const newGraphs = arrayImmutableSet(state.graphs, action.graphIndex, undefined);
  return objectJoin<State>(state, { graphs: newGraphs });
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
    case ActionType.AddTriple:
      return doAddTripleAction(state, action as AddTripleAction);
    case ActionType.DeleteGraph:
      return doDeleteGraphAction(state, action as DeleteGraphAction);
    default:
      return state;
  }
}
