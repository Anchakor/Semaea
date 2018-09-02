import { StoreLib, Reducer } from '../../External';
import { StoreState } from '../Main';
import { DeleteGraphDialog, Status as DialogStatus, DialogKind, AddTripleDialog } from '../../Dialogs/Dialog';
import { doCreateDialog } from '../Dialogs';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';
import { getOriginatingOrClosestSaViewIndex } from 'SaViews';

// CreateDeleteGraphDialogAction
export enum ActionType { CreateDeleteGraphDialog = 'CreateDeleteGraphDialog' }
export interface CreateDeleteGraphDialogAction extends StoreLib.Action { type: ActionType.CreateDeleteGraphDialog
  graphIndex: number
  originatingSaViewIndex: number
}
export const createCreateDeleteGraphDialogAction = (graphIndex: number, originatingSaViewIndex: number): CreateDeleteGraphDialogAction => 
  ({ type: ActionType.CreateDeleteGraphDialog, graphIndex: graphIndex, originatingSaViewIndex: originatingSaViewIndex });
function doCreateDeleteGraphDialogAction(state: StoreState, action: CreateDeleteGraphDialogAction) {
  // FEATURE maybe reopen cancelled dialogs if they exist
  const dialog: DeleteGraphDialog = { 
    status: DialogStatus.Opened, 
    kind: DialogKind.DeleteGraph,
    graphToDeleteIndex: action.graphIndex
  };
  return doCreateDialog(state, 
    dialog, 
    action.originatingSaViewIndex);
}

// CreateAddTripleDialogAction
export enum ActionType { CreateAddTripleDialog = 'CreateAddTripleDialog' }
export interface CreateAddTripleDialogAction extends StoreLib.Action { type: ActionType.CreateAddTripleDialog
  originatingSaViewIndex: number
}
export const createCreateAddTripleDialogAction = (originatingSaViewIndex: number): CreateAddTripleDialogAction => 
  ({ type: ActionType.CreateAddTripleDialog, originatingSaViewIndex: originatingSaViewIndex });
function doCreateAddTripleDialogAction(state: StoreState, action: CreateAddTripleDialogAction) {
  let triple = new Triple('', '', '');
  const originatingSaView = state.saViews_.saViews[action.originatingSaViewIndex];
  const originatingSaGraphView = state.graphs_.saGraphViews[originatingSaView.saGraphViewIndex];
  if (!originatingSaGraphView.currentNode) return state;
  const sourceTriple = originatingSaGraphView.currentNode.getTriple();
  switch (originatingSaGraphView.currentNode.position) {
    case 'p':
      triple.s = sourceTriple.getNodeAtPosition('s');
      triple.p = sourceTriple.getNodeAtPosition('p');
      break;
    case 'o':
      triple.s = sourceTriple.getNodeAtPosition('o');
      break;
    case 's':
    default:
      triple.s = sourceTriple.getNodeAtPosition('s');
      break;
  }
  const dialog: AddTripleDialog = { 
    status: DialogStatus.Opened, 
    kind: DialogKind.AddTriple,
    triple: triple
  }
  return doCreateDialog(state, 
    dialog, 
    action.originatingSaViewIndex);
}

// Reducer:

export const reducer: Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.CreateDeleteGraphDialog:
      return doCreateDeleteGraphDialogAction(state, action as CreateDeleteGraphDialogAction);
    case ActionType.CreateAddTripleDialog:
      return doCreateAddTripleDialogAction(state, action as CreateAddTripleDialogAction);
    default:
      return state;
  }
}
