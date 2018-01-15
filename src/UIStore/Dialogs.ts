import { Dialog, DeleteGraphDialog, Status as DialogStatus, DialogType } from '../Dialogs/Dialogs';
import { arrayImmutableSet, objectClone, objectJoin, arrayImmutableAppend } from '../Common';
import { StoreLib } from '../External';
import { StoreState } from './Main';
import { State as SaViewsState, SaView } from './SaViews';
import { State as GraphsState, SaGraphView } from './Graphs';

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

function doCreateDialog(state: StoreState, dialog: Dialog, originatingSaViewIndex: number) {
  // Creating a copy of SaView and SaGraphView
  const originatingSaView = state.saViews_.saViews[originatingSaViewIndex];
  const originatingSaGraphView = state.graphs_.saGraphViews[originatingSaView.saGraphViewIndex];

  const newSaGraphView = objectClone(originatingSaGraphView);
  const saGraphViews = arrayImmutableAppend(state.graphs_.saGraphViews, newSaGraphView);
  const newSaGraphViewIndex = saGraphViews.length - 1;

  const newSaView = objectJoin(originatingSaView, { saGraphViewIndex: newSaGraphViewIndex, originatingView: originatingSaViewIndex } as SaView)
  const saViews = arrayImmutableAppend(state.saViews_.saViews, newSaView);
  const newSaViewIndex = saViews.length - 1;

  // Dialog values
  const dialogs = arrayImmutableAppend(state.dialogs_.dialogs, dialog);
  const newDialogIndex = dialogs.length - 1;

  const newDialogSaViewMapping = { saViewIndex: newSaViewIndex, dialogIndex: newDialogIndex } as DialogSaViewMapping;
  const viewMappings = arrayImmutableAppend(state.dialogs_.viewMappings, newDialogSaViewMapping);

  return objectJoin(state, { 
    graphs_: objectJoin(state.graphs_, { saGraphViews: saGraphViews } as GraphsState),
    saViews_: objectJoin(state.saViews_, { saViews: saViews, currentSaViewIndex: newSaViewIndex } as SaViewsState),
    dialogs_: objectJoin(state.dialogs_, { dialogs: dialogs, viewMappings: viewMappings } as State)
  } as StoreState);
}

// Actions:

// CreateDeleteGraphDialogAction
export enum ActionType { CreateDeleteGraphDialog = 'CreateDeleteGraphDialog' }
export interface CreateDeleteGraphDialogAction extends StoreLib.Action { type: ActionType.CreateDeleteGraphDialog
  graphIndex: number
  originatingSaViewIndex: number
}
export const createCreateDeleteGraphDialogAction = (graphIndex: number, originatingSaViewIndex: number): CreateDeleteGraphDialogAction => 
  ({ type: ActionType.CreateDeleteGraphDialog, graphIndex: graphIndex, originatingSaViewIndex: originatingSaViewIndex });
function doCreateDeleteGraphDialogAction(state: StoreState, action: CreateDeleteGraphDialogAction) {
  return doCreateDialog(state, 
    { status: DialogStatus.Opened, 
      type: DialogType.DeleteGraph,
      graphToDeleteIndex: action.graphIndex
    } as DeleteGraphDialog, 
    action.originatingSaViewIndex);
}
//-dispatch:
//CreateDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => dispatch(createCreateDeleteGraphDialogAction(graphIndex, originatingSaViewIndex))

// Reducer:

export const reducer: StoreLib.Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    //case InitializeTestGraphActionTypeConst:
    //  return doInitializeTestGraphAction(state);
    case ActionType.CreateDeleteGraphDialog:
      return doCreateDeleteGraphDialogAction(state, action as CreateDeleteGraphDialogAction);
    default:
      return state;
  }
}
