import { CurrentProps } from './CurrentProps';
import { StoreState } from '../UIStore/Main';
import * as Key from '../Key';
import { MainDispatchProps } from 'Views/MainDispatchProps';
import { getDialogMappingsToSaView, shouldDialogBeVisible } from 'Dialogs/Dialog';

type Props = StoreState & MainDispatchProps & { current: CurrentProps }

export enum KeyEventOptions {
  Default = 0,
  KeepSpacebar = 1 << 0,
}

export const TextInputKeyEventOptions = KeyEventOptions.KeepSpacebar;

export function keyup(props: Props, options: KeyEventOptions) {
  return (event: KeyboardEvent) => {
    // TODO dialog/graph keydown handling
    if (Key.isSpacebar(event) && !(options && KeyEventOptions.KeepSpacebar)) {
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
    } else if (Key.isM(event)) {
      props.createDeleteGraphDialog(props.current.saGraphView.graphIndex, props.current.saViewIndex);
    } else if (Key.isN(event)) {
      if (!props.current.saGraphView.currentNode) return;
      props.createAddTripleDialog(props.current.saGraphView.currentNode, props.current.saViewIndex);
    }
  }
}

export function keydown(props: Props, options: KeyEventOptions) {
  return (event: KeyboardEvent) => {
    if ((Key.isSpacebar(event) && !(options && KeyEventOptions.KeepSpacebar))
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