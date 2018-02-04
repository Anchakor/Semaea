import { StoreLib } from '../../External';
import { StoreState } from '../Main';
import { DialogMenuDialog, Status as DialogStatus, DialogType } from '../../Dialogs/Dialogs';
import { doCreateDialog } from '../Dialogs';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';

// CreateDialogMenuDialogAction
export enum ActionType { CreateDialogMenuDialog = 'CreateDialogMenuDialog' }
export interface CreateDialogMenuDialogAction extends StoreLib.Action { type: ActionType.CreateDialogMenuDialog
  originatingSaViewIndex: number
}
export const createCreateDialogMenuDialogAction = (originatingSaViewIndex: number): CreateDialogMenuDialogAction => 
  ({ type: ActionType.CreateDialogMenuDialog, originatingSaViewIndex: originatingSaViewIndex });
function doCreateDialogMenuDialogAction(state: StoreState, action: CreateDialogMenuDialogAction) {
  const dialog: DialogMenuDialog = { 
    status: DialogStatus.Opened, 
    type: DialogType.DialogMenu,
    selectedDialog: undefined
  };
  return doCreateDialog(state, 
    dialog, 
    action.originatingSaViewIndex);
}

// Reducer:

export const reducer: StoreLib.Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.CreateDialogMenuDialog:
      return doCreateDialogMenuDialogAction(state, action as CreateDialogMenuDialogAction);
    default:
      return state;
  }
}

