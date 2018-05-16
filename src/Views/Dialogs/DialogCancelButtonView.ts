import { DialogProps } from '../DialogView';
import { Dialog } from '../../Dialogs/Dialog';
import { ButtonKeyEventOptions } from '../InputEventHandlers';
import { createFocusableElementProps } from '../FocusableElementProps';
import { FocusableComponent } from '../FocusableComponent';
import { FocusTarget } from '../../UIStore/Focus';
import { h, linkEvent } from '../../External';

type DialogCancelButtonProps = DialogProps<Dialog> & { additionCancelAction?: () => void }
export class DialogCancelButtonView extends FocusableComponent<DialogCancelButtonProps> {
  constructor(props: DialogCancelButtonProps, context?: any) { super(props, context); }
  readonly innerComponent = DialogCancelButtonViewInner
  readonly focusTarget = FocusTarget.DialogCancelButton
}
function DialogCancelButtonViewInner(dialogProps: DialogCancelButtonProps) {
  return h('button', createFocusableElementProps(ButtonKeyEventOptions, dialogProps, { 
    onclick: linkEvent(dialogProps, cancelDialogButtonOnClickHandler),
  }), 'Cancel')
}
function cancelDialogButtonOnClickHandler(dialogProps: DialogCancelButtonProps, event: Event) {
  if (dialogProps.additionCancelAction != undefined) dialogProps.additionCancelAction();
  dialogProps.cancelDialog(dialogProps.dialogIndex);
}