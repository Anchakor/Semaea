import { Dialog, Status as DialogStatus, DialogSaViewMapping } from '../Dialogs/Dialog';
import { arrayImmutableSet, objectClone, objectJoin, arrayImmutableAppend } from '../Common';
import { StoreLib, Reducer } from '../External';
import { StoreState } from './Main';
import { State as SaViewsState } from './SaViews';
import { State as GraphsState, SaGraphView, setCurrentNodeToFirstNode } from './Graphs';
import { SaView, getOriginatingOrClosestSaViewIndex } from '../SaViews';
import * as FileDialogCommon from './Dialogs/FileDialogCommon';
import * as BasicGraphDialogs from './Dialogs/BasicGraphDialogs';
import * as DialogMenuDialog from './Dialogs/DialogMenuDialog';
import * as OpenFileDialog from './Dialogs/OpenFileDialog';
import * as SaveFileDialog from './Dialogs/SaveFileDialog';
import { GraphFilter, GraphFilterConditionKind, GraphFilterConditionSubjectContains, createDefaultGraphFilter, cloneGraphFilter } from './GraphFilters';
import { GraphNode } from 'Graphs/GraphNode';

/* Dialogs
Dialogs are temporary UI views for doing some action.
Dialogs create a new (clone) SaView, when SaView is closed, so is Dialog, when is Dialog closed, so is SaView (unless configured otherwise). Same for SaGraphView.
Dialogs 0..1 - 0..* SaViews
*/

export interface State {
  readonly viewMappings: DialogSaViewMapping[]
  readonly dialogs: Dialog[]
}
export const defaultState: State = { 
  viewMappings: [],
  dialogs: [],
};

/**
 * For use in other reducer functions.
 * @param originatingSaViewIndex SaView from which the dialog creation was triggered
 * @param graphIndex GraphIndex to use for the dialog SaView, if undefined the graph from originatingSaGraphView is used
 * @param graphFilter GraphFilter to use for the dialog SaGraphView, if undefined the filter is copied from the originatingSaGraphView
 */
export function doCreateDialog(state: StoreState, dialog: Dialog, originatingSaViewIndex: number, graphIndex?: number, graphFilter?: GraphFilter) {
  // Creating a copy of SaView and SaGraphView
  const originatingSaView = state.saViews_.saViews[originatingSaViewIndex];
  const originatingSaGraphView = state.graphs_.saGraphViews[originatingSaView.saGraphViewIndex];

  const newGraphFilter = (graphFilter) 
    ? graphFilter 
    : (originatingSaGraphView.filter) ? cloneGraphFilter(originatingSaGraphView.filter) : undefined;
  // If graphFilter is changed (partially) reset currentNode to ease up/down arrow navigation
  const currentNode = (graphFilter && originatingSaGraphView.currentNode)
    ? new GraphNode(originatingSaGraphView.currentNode.getTriple(), 's')
    : originatingSaGraphView.currentNode
  let newSaGraphView = (graphIndex == undefined) 
    ? objectJoin<SaGraphView>(originatingSaGraphView, { filter: newGraphFilter, currentNode: currentNode })
    : objectJoin<SaGraphView>(originatingSaGraphView, { filter: newGraphFilter, currentNode: currentNode, graphIndex: graphIndex });
  const saGraphViews = arrayImmutableAppend(state.graphs_.saGraphViews, newSaGraphView);
  const newSaGraphViewIndex = saGraphViews.length - 1;

  const newSaView = objectJoin<SaView>(originatingSaView, { saGraphViewIndex: newSaGraphViewIndex, originatingSaViewIndex: originatingSaViewIndex })
  const saViews = arrayImmutableAppend(state.saViews_.saViews, newSaView);
  const newSaViewIndex = saViews.length - 1;

  // Dialog values
  const dialogs = arrayImmutableAppend(state.dialogs_.dialogs, dialog);
  const newDialogIndex = dialogs.length - 1;

  const newDialogSaViewMapping: DialogSaViewMapping = { 
    saViewIndex: newSaViewIndex, dialogIndex: newDialogIndex 
  };
  const viewMappings = arrayImmutableAppend(state.dialogs_.viewMappings, newDialogSaViewMapping);

  return objectJoin<StoreState>(state, { 
    graphs_: objectJoin<GraphsState>(state.graphs_, { saGraphViews: saGraphViews }),
    saViews_: objectJoin<SaViewsState>(state.saViews_, { saViews: saViews, currentSaViewIndex: newSaViewIndex }),
    dialogs_: objectJoin<State>(state.dialogs_, { dialogs: dialogs, viewMappings: viewMappings })
  });
}

// Actions:

// CancelDialogAction
export enum ActionType { CancelDialog = 'CancelDialog' }
export interface CancelDialogAction extends StoreLib.Action { type: ActionType.CancelDialog
  dialogIndex: number
}
export const createCancelDialogAction = (dialogIndex: number): CancelDialogAction => 
  ({ type: ActionType.CancelDialog, dialogIndex: dialogIndex });
function doCancelDialogAction(state: StoreState, action: CancelDialogAction) {
  const dialog = state.dialogs_.dialogs[action.dialogIndex];
  const newDialog = objectJoin<Dialog>(dialog, { status: DialogStatus.Cancelled })
  const dialogs = arrayImmutableSet(state.dialogs_.dialogs, action.dialogIndex, newDialog);
  const newCurrentSaViewIndex = getOriginatingOrClosestSaViewIndex(state.saViews_.currentSaViewIndex, state);
  return objectJoin<StoreState>(state, { 
    saViews_: objectJoin<SaViewsState>(state.saViews_, { currentSaViewIndex: newCurrentSaViewIndex }),
    dialogs_: objectJoin<State>(state.dialogs_, { dialogs: dialogs })
  });
}

// FinishDialogAction
export enum ActionType { FinishDialog = 'FinishDialog' }
export interface FinishDialogAction extends StoreLib.Action { type: ActionType.FinishDialog
  dialogIndex: number
}
export const createFinishDialogAction = (dialogIndex: number): FinishDialogAction => 
  ({ type: ActionType.FinishDialog, dialogIndex: dialogIndex });
function doFinishDialogAction(state: StoreState, action: FinishDialogAction) {
  const dialog = state.dialogs_.dialogs[action.dialogIndex];
  const newDialog = objectJoin<Dialog>(dialog, { status: DialogStatus.Finished })
  const dialogs = arrayImmutableSet(state.dialogs_.dialogs, action.dialogIndex, newDialog);
  const newCurrentSaViewIndex = getOriginatingOrClosestSaViewIndex(state.saViews_.currentSaViewIndex, state);
  return objectJoin<StoreState>(state, { 
    saViews_: objectJoin<SaViewsState>(state.saViews_, { currentSaViewIndex: newCurrentSaViewIndex }),
    dialogs_: objectJoin<State>(state.dialogs_, { dialogs: dialogs })
  });
}

// Reducer:

export const reducer: Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  let newState = BasicGraphDialogs.reducer(state, action);
  if (newState != state) { return newState; }
  newState = FileDialogCommon.reducer(state, action);
  if (newState != state) { return newState; }
  newState = DialogMenuDialog.reducer(state, action);
  if (newState != state) { return newState; }
  newState = OpenFileDialog.reducer(state, action);
  if (newState != state) { return newState; }
  newState = SaveFileDialog.reducer(state, action);
  if (newState != state) { return newState; }

  switch (action.type) {    
    case ActionType.CancelDialog:
      return doCancelDialogAction(state, action as CancelDialogAction);
    case ActionType.FinishDialog:
      return doFinishDialogAction(state, action as FinishDialogAction);
    default:
      return state;
  }
}
