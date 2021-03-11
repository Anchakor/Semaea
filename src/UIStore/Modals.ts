import { arrayImmutableSet, objectJoin } from '../Common';
import { StoreLib, UIStoreTools } from '../External';

export interface Modal {
  type: ModalType
  originatingGraphIndex: number
}

export enum ModalType { AlertModal = 'AlertModal' }
export interface AlertModal extends Modal {
  message: string
}

export interface State {
  readonly modals: Modal[]
}
export const defaultState: State = {
  modals: []
}

const slice = UIStoreTools.createSlice({
  name: 'Modals',
  initialState: defaultState,
  reducers: {
    showAlertModal: (state, a: UIStoreTools.PayloadAction<{originatingGraphIndex: number, message: string}>) => {
      const modal: AlertModal = { 
        type: ModalType.AlertModal,
        originatingGraphIndex: a.payload.originatingGraphIndex,
        message: a.payload.message 
      };
      state.modals.push(modal);
    },
    closeModalByIndex: (state, a: UIStoreTools.PayloadAction<number>) => {
      state.modals.splice(a.payload, 1);
    }
  }
});

export const {
  showAlertModal,
  closeModalByIndex
} = slice.actions;

export const reducer = slice.reducer;
/*
// Actions:

export enum ActionType { ShowAlertModal = 'ShowAlertModal' }
export interface ShowAlertModalAction extends StoreLib.Action { type: ActionType.ShowAlertModal
  originatingGraphIndex: number
  message: string
}
export const createShowAlertModalAction = (originatingGraphIndex: number, message: string): ShowAlertModalAction => 
  ({ type: ActionType.ShowAlertModal, originatingGraphIndex: originatingGraphIndex, message: message });
function doShowAlertModalAction(state: State, action: ShowAlertModalAction): State {
  const modal: AlertModal = { 
    type: ModalType.AlertModal,
    originatingGraphIndex: action.originatingGraphIndex,
    message: action.message 
  };
  return objectJoin(state, { 
    modals: arrayImmutableSet(state.modals, state.modals.length, modal)
  });
}

export enum ActionType { CloseModal = 'CloseModal' }
export interface CloseModalAction extends StoreLib.Action { type: ActionType.CloseModal
  modalIndex: number
}
export const createCloseModalAction = (modalIndex: number): CloseModalAction => 
  ({ type: ActionType.CloseModal, modalIndex: modalIndex });
function doCloseModalAction(state: State, action: CloseModalAction): State {
  return objectJoin(state, { 
    modals: state.modals.filter((val: Modal, ix: number, array: Modal[]) => {
      return ix != action.modalIndex;
    })
  });
}

// Reducers:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.ShowAlertModal:
      return doShowAlertModalAction(state, action as ShowAlertModalAction);
    case ActionType.CloseModal:
      return doCloseModalAction(state, action as CloseModalAction);
    default:
      return state;
  }
}
*/
