import { Dialog } from '../Dialogs/Dialogs';
import { arrayImmutableSet, objectClone, objectJoin } from '../Common';
import { StoreLib } from '../External';

export interface DialogSaViewMapping {
  dialogIndex: number
  saViewIndex: number
}

export interface State {
  viewMappings: DialogSaViewMapping[]
  dialogs: Dialog[]
}
export let defaultState: State = { 
  viewMappings: [],
  dialogs: [],
};

// Actions:

// TODO CreateDeleteGraphDialogAction

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    //case InitializeTestGraphActionTypeConst:
    //  return doInitializeTestGraphAction(state);
    default:
      return state;
  }
}
