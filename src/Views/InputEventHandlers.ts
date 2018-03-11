import { CurrentProps } from './CurrentProps';
import { StoreState } from '../UIStore/Main';
import * as Key from '../Key';
import { MainDispatchProps } from 'Views/MainDispatchProps';
import { getDialogMappingsToSaView, shouldDialogBeVisible } from 'Dialogs/Dialog';

/*
 Common event handling callbacks for UI (HTML) elements.
 */

type Props = StoreState & MainDispatchProps & { current: CurrentProps }

export enum KeyEventOptions {
  Default = 0,
  KeepSpacebar = 1 << 0,
  KeepTextInputKeys = 1 << 1,
}

export const TextInputKeyEventOptions = KeyEventOptions.KeepSpacebar | KeyEventOptions.KeepTextInputKeys;
export const ButtonKeyEventOptions = KeyEventOptions.KeepSpacebar;

export function getKeyupHandler(options: KeyEventOptions) {
  return (props: Props, event: KeyboardEvent) => {
    if (Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
      props.createDialogMenuDialog(props.current.saViewIndex);
      event.preventDefault();
    } else if (Key.isEscape(event)) {
      cancelLinkedDialogs(props);
    } else if (Key.isDownArrow(event)) {
      props.changeCurrentGraphNodeByOffset(props.current.saGraphViewIndex, 1);
      event.preventDefault();
    } else if (Key.isUpArrow(event)) {
      props.changeCurrentGraphNodeByOffset(props.current.saGraphViewIndex, -1);
      event.preventDefault();
    } else if (Key.isM(event) && !(options & KeyEventOptions.KeepTextInputKeys)) {
      props.createDeleteGraphDialog(props.current.saGraphView.graphIndex, props.current.saViewIndex);
    } else if (Key.isN(event) && !(options & KeyEventOptions.KeepTextInputKeys)) {
      if (!props.current.saGraphView.currentNode) return;
      props.createAddTripleDialog(props.current.saGraphView.currentNode, props.current.saViewIndex);
    }
  }
}

export function getKeydownHandler(options: KeyEventOptions) {
  return (props: Props, event: KeyboardEvent) => {
    if ((Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar))
      || Key.isDownArrow(event)
      || Key.isUpArrow(event)) {
      event.preventDefault();
    }
  }
}

function cancelLinkedDialogs(props: Props) {
  const linkedDialogs = getDialogMappingsToSaView(props.current.saViewIndex, props.dialogs_.viewMappings);
  if (linkedDialogs.length == 0) return;
  linkedDialogs.every((v, i, a) => {
    const dialog = props.dialogs_.dialogs[v.dialogIndex];
    if (!dialog || !shouldDialogBeVisible(dialog)) return true;
    props.cancelDialog(v.dialogIndex); return true;
  });
}