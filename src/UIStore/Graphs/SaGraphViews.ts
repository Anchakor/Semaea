import { arrayImmutableSet, objectClone, objectJoin, getSequenceIndexByOffset } from '../../Common';
import { StoreLib, UILib, UIStoreLib, Reducer, StoreLibThunk } from '../../External';
import { Graph } from '../../Graphs/Graph';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';
import { SaView } from '../../SaViews';
import { State, SaGraphView } from '../Graphs';
import { getSaGraphViewFilteredTriples } from '../GraphFilters';
import { StoreState } from '../Main';
import { getCurrentProps } from '../../Views/CurrentProps';
import { setChangeFocusToGraphFilter, setChangeFocusToGraphView } from '../Focus';
import { dialogEntityMouseClickHandler } from '../../Views/Dialogs/DialogEventHandlers';
import { createCreateDialogMenuDialogAction } from '../Dialogs/DialogMenuDialog';
import { showAlertModal } from '../Modals';


export const thunkEntityMouseEvent = (event: MouseEvent, graphNode: GraphNode): 
  StoreLibThunk.ThunkAction<void, StoreState, unknown, StoreLib.Action<string>> => 
  (dispatch, getState) => {
    const current = getCurrentProps(getState());
    const currentNode = current.saGraphView.currentNode;
    const alreadyIsCurrentNode = (currentNode && graphNode.equals(currentNode));
    if (!alreadyIsCurrentNode) { 
      dispatch(createChangeCurrentNodeAction(current.saGraphViewIndex, graphNode));
    }
    dispatch(setChangeFocusToGraphView());

    if (dialogEntityMouseClickHandler(dispatch, getState, event, graphNode)) return;
  
    if (event.button == 2) {
      dispatch(createCreateDialogMenuDialogAction(current.saViewIndex));
      dispatch(setChangeFocusToGraphFilter());
      event.preventDefault();
      return;
    }
  
    if (alreadyIsCurrentNode) {
      dispatch(showAlertModal({
        originatingGraphIndex: current.saGraphView.graphIndex,
        message: "Some message "+graphNode.toString()+"."
      }));
    }
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

// ChangeCurrentGraphNodeByOffsetAction // TODO when graph view components are defined
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
  let newTripleIndex = getSequenceIndexByOffset(triples.length, tripleIndex, action.offset);
  const newTriple = triples[newTripleIndex];
  if (!newTriple) return state;
  const newCurrentNode = new GraphNode(newTriple, currentNode.position);
  const newSaGraphView = objectJoin<SaGraphView>(saGraphView, { currentNode: newCurrentNode });
  return objectJoin<State>(state, { 
    saGraphViews: arrayImmutableSet(state.saGraphViews, action.saGraphViewIndex, newSaGraphView)
  });
}

// ChangeCurrentGraphNodeHorizontallyByOffsetAction // TODO when graph view components are defined
export enum ActionType { ChangeCurrentGraphNodeHorizontallyByOffset = 'ChangeCurrentGraphNodeHorizontallyByOffset' }
export interface ChangeCurrentGraphNodeHorizontallyByOffsetAction extends StoreLib.Action { type: ActionType.ChangeCurrentGraphNodeHorizontallyByOffset
  saGraphViewIndex: number
  offset: number
}
export const createChangeCurrentGraphNodeHorizontallyByOffsetAction = (saGraphViewIndex: number, offset: number): ChangeCurrentGraphNodeHorizontallyByOffsetAction => 
  ({ type: ActionType.ChangeCurrentGraphNodeHorizontallyByOffset, saGraphViewIndex: saGraphViewIndex, offset: offset });
function doChangeCurrentGraphNodeHorizontallyByOffsetAction(state: State, action: ChangeCurrentGraphNodeHorizontallyByOffsetAction) {
  const saGraphView = state.saGraphViews[action.saGraphViewIndex];
  const graphs = state.graphs;
  const currentNode = saGraphView.currentNode;
  if (!currentNode) return state;
  const graph = graphs[saGraphView.graphIndex];
  if (!graph) return state;
  const triples = getSaGraphViewFilteredTriples(saGraphView, graph);
  if (triples.length < 1) return state;
  
  function getGraphNodeSequences(node: GraphNode, triples: Triple[]) {
    return triples.map((t) => [new GraphNode(t, 's'), new GraphNode(t, 'p'), new GraphNode(t, 'o')]);
  }
  const sequences = getGraphNodeSequences(currentNode, triples);
  const currentSequenceIndex = sequences.findIndex((s) => s.some((gn) => currentNode.equals(gn)));
  const currentSequence = sequences[currentSequenceIndex];
  const inCurrentSequenceIndex = currentSequence.findIndex((gn) => currentNode.equals(gn));
  function getNewCurrentNode(sequences: GraphNode[][], sequenceIndex: number, offset: number, inSequenceIndex?: number): GraphNode {
    const currentSequence = sequences[sequenceIndex];
    if (inSequenceIndex == undefined) inSequenceIndex = (offset < 0) ? currentSequence.length : 0;
    const newInSequenceIndex = (inSequenceIndex + offset);
    if (newInSequenceIndex < 0) {
      return getNewCurrentNode(sequences, getSequenceIndexByOffset(sequences.length, sequenceIndex, -1), newInSequenceIndex);
    } else if (newInSequenceIndex >= currentSequence.length) {
      return getNewCurrentNode(sequences, getSequenceIndexByOffset(sequences.length, sequenceIndex, 1), newInSequenceIndex - currentSequence.length);
    }
    return currentSequence[newInSequenceIndex];
  }
  const newCurrentNode = getNewCurrentNode(sequences, currentSequenceIndex, action.offset, inCurrentSequenceIndex);
  const newSaGraphView = objectJoin<SaGraphView>(saGraphView, { currentNode: newCurrentNode });
  return objectJoin<State>(state, { 
    saGraphViews: arrayImmutableSet(state.saGraphViews, action.saGraphViewIndex, newSaGraphView)
  });
}

// Reducer:

export const reducer: Reducer<State> = (state: State, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.ChangeSaGraphViewGraph:
      return doChangeSaGraphViewGraphAction(state, action as ChangeSaGraphViewGraphAction);
    case ActionType.ChangeCurrentNode:
      return doChangeCurrentNodeAction(state, action as ChangeCurrentNodeAction);
    case ActionType.ChangeCurrentGraphNodeByOffset:
      return doChangeCurrentGraphNodeByOffsetAction(state, action as ChangeCurrentGraphNodeByOffsetAction);
    case ActionType.ChangeCurrentGraphNodeHorizontallyByOffset:
      return doChangeCurrentGraphNodeHorizontallyByOffsetAction(state, action as ChangeCurrentGraphNodeHorizontallyByOffsetAction);
    default:
      return state;
  }
}