import { getCurrentProps } from './CurrentProps';
import { StoreState, DispatchProps } from '../UIStore/Main';
import * as Key from '../Key';
import { getDialogMappingsToSaView, shouldDialogBeVisible } from '../Dialogs/Dialog';
import { dialogKeyHandler } from './Dialogs/DialogEventHandlers';
import { StoreLibThunk, StoreLib, Dispatch } from '../External';
import { createCreateDialogMenuDialogAction } from '../UIStore/Dialogs/DialogMenuDialog';
import { setChangeFocusToGraphFilter, setChangeFocusToGraphView, setChangeFocusToDialogCancelButton } from '../UIStore/Focus';
import { createDeleteGraphAction } from '../UIStore/Graphs';
import { createCancelDialogAction } from '../UIStore/Dialogs';
import { createChangeCurrentGraphNodeByOffsetAction, createChangeCurrentGraphNodeHorizontallyByOffsetAction } from '../UIStore/Graphs/SaGraphViews';
import { createCreateDeleteGraphDialogAction, createCreateAddTripleDialogAction } from '../UIStore/Dialogs/BasicGraphDialogs';

/*
 Common event handling callbacks for UI (HTML) elements.
 */

export enum KeyEventType {
  keyDown = 'keyDown',
  keyUp = 'keyUp',
}

export enum KeyEventOptions {
  Default = 0,
  KeepSpacebar = 1 << 0,
  KeepTextInputKeys = 1 << 1,
}

export const TextInputKeyEventOptions = KeyEventOptions.KeepSpacebar | KeyEventOptions.KeepTextInputKeys;
export const ButtonKeyEventOptions = KeyEventOptions.KeepSpacebar;

export const getKeyupHandler = (dispatch: Dispatch<StoreState>, options: KeyEventOptions) => {
  return (props: DispatchProps, event: KeyboardEvent) => {
    props.dispatch(thunkKeyupEvent(options, event))
  }
}

const thunkKeyupEvent = (options: KeyEventOptions, event: KeyboardEvent): 
  StoreLibThunk.ThunkAction<void, StoreState, unknown, StoreLib.Action<string>> => 
  (dispatch, getState) => {
    if (dialogKeyHandler(dispatch, getState, event, options, KeyEventType.keyUp)) return;

    const current = getCurrentProps(getState());
    if (Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
      dispatch(createCreateDialogMenuDialogAction(current.saViewIndex));
      dispatch(setChangeFocusToGraphFilter());
      event.preventDefault();
    } else if (Key.isEscape(event)) {
      cancelLinkedDialogs(dispatch, getState);
    } else if (Key.isDownArrow(event)) {
      dispatch(createChangeCurrentGraphNodeByOffsetAction(current.saGraphViewIndex, 1));
      dispatch(setChangeFocusToGraphView());
      event.preventDefault();
    } else if (Key.isUpArrow(event)) {
      dispatch(createChangeCurrentGraphNodeByOffsetAction(current.saGraphViewIndex, -1));
      dispatch(setChangeFocusToGraphView());
      event.preventDefault();
    } else if (Key.isRightArrow(event) && !(options & KeyEventOptions.KeepTextInputKeys)) {
      dispatch(createChangeCurrentGraphNodeHorizontallyByOffsetAction(current.saGraphViewIndex, 1));
      dispatch(setChangeFocusToGraphView());
      event.preventDefault();
    } else if (Key.isLeftArrow(event) && !(options & KeyEventOptions.KeepTextInputKeys)) {
      dispatch(createChangeCurrentGraphNodeHorizontallyByOffsetAction(current.saGraphViewIndex, -1));
      dispatch(setChangeFocusToGraphView());
      event.preventDefault();
    } else if (Key.isM(event) && !(options & KeyEventOptions.KeepTextInputKeys)) {
      dispatch(createCreateDeleteGraphDialogAction(current.saGraphView.graphIndex, current.saViewIndex));
      dispatch(setChangeFocusToDialogCancelButton());
    } else if (Key.isN(event) && !(options & KeyEventOptions.KeepTextInputKeys)) {
      if (!current.saGraphView.currentNode) return;
      dispatch(createCreateAddTripleDialogAction(current.saViewIndex));
      dispatch(setChangeFocusToDialogCancelButton());
    }
}

export const getKeydownHandler = (dispatch: Dispatch<StoreState>, options: KeyEventOptions) => {
  return (props: DispatchProps, event: KeyboardEvent) => {
    props.dispatch(thunkKeydownEvent(options, event))
  }
}

const thunkKeydownEvent = (options: KeyEventOptions, event: KeyboardEvent): 
  StoreLibThunk.ThunkAction<void, StoreState, unknown, StoreLib.Action<string>> => 
  (dispatch, getState) => {
    if (dialogKeyHandler(dispatch, getState, event, options, KeyEventType.keyDown)) return;

    if ((Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar))
      || Key.isDownArrow(event)
      || Key.isUpArrow(event)) {
      event.preventDefault();
    }
}

function cancelLinkedDialogs(dispatch: Dispatch<StoreState>, getState: () => StoreState) {
  const current = getCurrentProps(getState());
  const state = getState();
  const linkedDialogs = getDialogMappingsToSaView(current.saViewIndex, state.dialogs_.viewMappings);
  if (linkedDialogs.length == 0) return;
  linkedDialogs.every((v, i, a) => {
    const dialog = state.dialogs_.dialogs[v.dialogIndex];
    if (!dialog || !shouldDialogBeVisible(dialog)) return true;
    if (dialog.createdGraphIndex != undefined) { dispatch(createDeleteGraphAction(dialog.createdGraphIndex)); }
    dispatch(createCancelDialogAction(v.dialogIndex));
    dispatch(setChangeFocusToGraphView());
    return true;
  });
}