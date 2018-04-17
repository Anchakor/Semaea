import { StoreLib } from '../../External';
import { StoreState } from '../Main';
import { DeleteGraphDialog, Status as DialogStatus, DialogType, AddTripleDialog } from '../../Dialogs/Dialog';
import { doCreateDialog } from '../Dialogs';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';

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
    type: DialogType.DeleteGraph,
    graphToDeleteIndex: action.graphIndex
  };
  return doCreateDialog(state, 
    dialog, 
    action.originatingSaViewIndex);
}

// CreateAddTripleDialogAction
export enum ActionType { CreateAddTripleDialog = 'CreateAddTripleDialog' }
export interface CreateAddTripleDialogAction extends StoreLib.Action { type: ActionType.CreateAddTripleDialog
  graphNode: GraphNode
  originatingSaViewIndex: number
}
export const createCreateAddTripleDialogAction = (GraphNode: GraphNode, originatingSaViewIndex: number): CreateAddTripleDialogAction => 
  ({ type: ActionType.CreateAddTripleDialog, graphNode: GraphNode, originatingSaViewIndex: originatingSaViewIndex });
function doCreateAddTripleDialogAction(state: StoreState, action: CreateAddTripleDialogAction) {
  let triple = new Triple('', '', '');
  const sourceTriple = action.graphNode.getTriple();
  switch (action.graphNode.position) {
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
    type: DialogType.AddTriple,
    triple: triple
  }
  return doCreateDialog(state, 
    dialog, 
    action.originatingSaViewIndex,
    undefined,
    true
  );
}

// Reducer:

export const reducer: StoreLib.Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.CreateDeleteGraphDialog:
      return doCreateDeleteGraphDialogAction(state, action as CreateDeleteGraphDialogAction);
    case ActionType.CreateAddTripleDialog:
      return doCreateAddTripleDialogAction(state, action as CreateAddTripleDialogAction);
    default:
      return state;
  }
}
