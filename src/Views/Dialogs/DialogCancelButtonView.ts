import { DialogProps } from '../DialogView';
import { Dialog } from '../../Dialogs/Dialog';
import { ButtonKeyEventOptions } from '../InputEventHandlers';
import { createFocusableElementProps } from '../FocusableElementProps';
import { withFocusable } from '../FocusableComponent';
import { FocusTarget } from '../../UIStore/Focus';
import { h, linkEvent } from '../../External';

type DialogCancelButtonProps = DialogProps<Dialog>

export const DialogCancelButtonView = withFocusable(
  DialogCancelButtonViewInner,
  FocusTarget.DialogCancelButton,
)
function DialogCancelButtonViewInner(dialogProps: DialogCancelButtonProps) {
  return h('button', createFocusableElementProps(ButtonKeyEventOptions, dialogProps, { 
    onclick: linkEvent(dialogProps, cancelDialogButtonOnClickHandler),
  }), 'Cancel')
}
function cancelDialogButtonOnClickHandler(dialogProps: DialogCancelButtonProps, event: Event) {
  dialogProps.cancelDialog(dialogProps.dialogIndex, dialogProps.dialog.createdGraphIndex);
}