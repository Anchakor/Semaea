import { arrayImmutableSet, objectJoin } from '../Common';
import { StoreLib } from '../External';

export type ModalType = AlertModalType

export interface Modal {
  type: ModalType
  originatingGraphIndex: number
}

export const AlertModalTypeConst = 'AlertModal'
export type AlertModalType = 'AlertModal'
export interface AlertModal extends Modal {
  message: string
}

export interface State {
  modals: Modal[]
}
export const defaultState: State = {
  modals: []
}

// Actions:

// ShowAlertModalAction
export const ShowAlertModalActionTypeConst = 'ShowAlertModalAction';
export type ShowAlertModalActionType = 'ShowAlertModalAction';
export interface ShowAlertModalAction extends StoreLib.Action { type: ShowAlertModalActionType
  originatingGraphIndex: number
  message: string
}
export const createShowAlertModalAction = (originatingGraphIndex: number, message: string) => 
  ({ type: ShowAlertModalActionTypeConst, originatingGraphIndex: originatingGraphIndex, message: message } as ShowAlertModalAction);
function doShowAlertModalAction(state: State, action: ShowAlertModalAction) {
  const modal: AlertModal = { 
    type: AlertModalTypeConst,
    originatingGraphIndex: action.originatingGraphIndex,
    message: action.message 
  };
  return objectJoin(state, { 
    modals: arrayImmutableSet(state.modals, state.modals.length, modal)
  });
}

// CloseModalAction
export const CloseModalActionTypeConst = 'CloseModalAction';
export type CloseModalActionType = 'CloseModalAction';
export interface CloseModalAction extends StoreLib.Action { type: CloseModalActionType
  modalIndex: number
}
export const createCloseModalAction = (modalIndex: number) => 
  ({ type: CloseModalActionTypeConst, modalIndex: modalIndex } as CloseModalAction);
function doCloseModalAction(state: State, action: CloseModalAction) {
  return objectJoin(state, { 
    modals: state.modals.filter((val: Modal, ix: number, array: Modal[]) => {
      return ix != action.modalIndex;
    })
  });
}

// Reducers:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case ShowAlertModalActionTypeConst:
      return doShowAlertModalAction(state, action as ShowAlertModalAction);
    case CloseModalActionTypeConst:
      return doCloseModalAction(state, action as CloseModalAction);
    default:
      return state;
  }
}

