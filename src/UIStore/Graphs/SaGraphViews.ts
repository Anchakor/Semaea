import { arrayImmutableSet, objectClone, objectJoin } from '../../Common';
import { StoreLib, UILib, UIStoreLib } from '../../External';
import { Graph } from '../../Graphs/Graph';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';
import { SaView } from '../../SaViews';
import { State, SaGraphView } from '../Graphs';
import { getSaGraphViewFilteredTriples } from 'UIStore/GraphFilters';

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

// ChangeCurrentGraphNodeByOffsetAction
export enum ActionType { ChangeCurrentGraphNodeByOffset = 'ChangeCurrentGraphNodeByOffset' }
export interface ChangeCurrentGraphNodeByOffsetAction extends StoreLib.Action { type: ActionType.ChangeCurrentGraphNodeByOffset
  saGraphViewIndex: number
  offset: number
}
export const createChangeCurrentGraphNodeByOffsetAction = (saGraphViewIndex: number, offset: number): ChangeCurrentGraphNodeByOffsetAction => 
  ({ type: ActionType.ChangeCurrentGraphNodeByOffset, saGraphViewIndex: saGraphViewIndex, offset: offset });
function doChangeCurrentGraphNodeByOffsetAction(state: State, action: ChangeCurrentGraphNodeByOffsetAction) {
  const saGraphView = state.saGraphViews[action.saGraphViewIndex];
  const graphs = state.graphs;
  const currentNode = saGraphView.currentNode;
  if (!currentNode) return state;
  const graph = graphs[saGraphView.graphIndex];
  if (!graph) return state;
  const triples = getSaGraphViewFilteredTriples(saGraphView, graph);
  if (triples.length < 1) return state;
  const tripleIndex = triples.findIndex((triple) => currentNode.getTriple().equals(triple));
  let newTripleIndex = (tripleIndex + action.offset) % triples.length;
  while (newTripleIndex < 0) {
    newTripleIndex += triples.length;
  }
  const newTriple = triples[newTripleIndex];
  if (!newTriple) return state;
  const newCurrentNode = new GraphNode(newTriple, currentNode.position);
  const newSaGraphView = objectJoin<SaGraphView>(saGraphView, { currentNode: newCurrentNode });
  return objectJoin<State>(state, { 
    saGraphViews: arrayImmutableSet(state.saGraphViews, action.saGraphViewIndex, newSaGraphView)
  });
}

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.ChangeSaGraphViewGraph:
      return doChangeSaGraphViewGraphAction(state, action as ChangeSaGraphViewGraphAction);
    case ActionType.ChangeCurrentNode:
      return doChangeCurrentNodeAction(state, action as ChangeCurrentNodeAction);
    case ActionType.ChangeCurrentGraphNodeByOffset:
      return doChangeCurrentGraphNodeByOffsetAction(state, action as ChangeCurrentGraphNodeByOffsetAction);
    default:
      return state;
  }
}