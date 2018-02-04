import { Dialog, Status as DialogStatus } from '../Dialogs/Dialogs';
import { arrayImmutableSet, objectClone, objectJoin, arrayImmutableAppend } from '../Common';
import { StoreLib } from '../External';
import { StoreState } from './Main';
import { State as SaViewsState } from './SaViews';
import { State as GraphsState } from './Graphs';
import { SaView, getClosestVisibleSaViewIndex } from '../SaViews';
import * as BasicGraphDialogs from './Dialogs/BasicGraphDialogs';

/* Dialogs
Dialogs are temporary UI views for doing some action.
Dialogs create a new (clone) SaView, when SaView is closed, so is Dialog, when is Dialog closed, so is SaView (unless configured otherwise). Same for SaGraphView.
Dialogs 0..1 - 0..* SaViews
*/

export interface DialogSaViewMapping {
  readonly dialogIndex: number
  readonly saViewIndex: number
}

export interface State {
  readonly viewMappings: DialogSaViewMapping[]
  readonly dialogs: Dialog[]
}
export let defaultState: State = { 
  viewMappings: [],
  dialogs: [],
};

export function doCreateDialog(state: StoreState, dialog: Dialog, originatingSaViewIndex: number) {
  // Creating a copy of SaView and SaGraphView
  const originatingSaView = state.saViews_.saViews[originatingSaViewIndex];
  const originatingSaGraphView = state.graphs_.saGraphViews[originatingSaView.saGraphViewIndex];

  const newSaGraphView = objectClone(originatingSaGraphView);
  const saGraphViews = arrayImmutableAppend(state.graphs_.saGraphViews, newSaGraphView);
  const newSaGraphViewIndex = saGraphViews.length - 1;

  const newSaView = objectJoin<SaView>(originatingSaView, { saGraphViewIndex: newSaGraphViewIndex, originatingView: originatingSaViewIndex })
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
  const newCurrentSaViewIndex = getClosestVisibleSaViewIndex(state.saViews_.currentSaViewIndex, state);
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
  const newCurrentSaViewIndex = getClosestVisibleSaViewIndex(state.saViews_.currentSaViewIndex, state);
  return objectJoin<StoreState>(state, { 
    saViews_: objectJoin<SaViewsState>(state.saViews_, { currentSaViewIndex: newCurrentSaViewIndex }),
    dialogs_: objectJoin<State>(state.dialogs_, { dialogs: dialogs })
  });
}

// Reducer:

export const reducer: StoreLib.Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  const newState = BasicGraphDialogs.reducer(state, action);
  if (newState != state) { return newState; } // TODO unit test this works

  switch (action.type) {    
    case ActionType.CancelDialog:
      return doCancelDialogAction(state, action as CancelDialogAction);
    case ActionType.FinishDialog:
      return doFinishDialogAction(state, action as FinishDialogAction);
    default:
      return state;
  }
}
