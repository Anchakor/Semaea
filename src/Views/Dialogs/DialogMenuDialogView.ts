import { h, hc } from '../../External';
import { DialogProps, DialogCancelButtonView } from '../DialogView';
import { DialogMenuDialog } from '../../Dialogs/Dialog';
import { objectJoinExtend } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions } from '../InputEventHandlers';
import { KeyEventType } from '../DialogEventHandlers';
import * as Key from '../../Key';

export function DialogMenuDialogView(props: DialogProps<DialogMenuDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    ' ', 
    hc(DialogCancelButtonView, objectJoinExtend(props, { additionCancelAction: () => props.deleteGraph(props.dialog.createdGraphIndex) })) 
  ]);
}

export function dialogMenuDialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type = KeyEventType.keyUp) {
      alert("asf");
      event.preventDefault();
    } else {
      event.preventDefault();
    }
    return true;
  }
  return false;
}