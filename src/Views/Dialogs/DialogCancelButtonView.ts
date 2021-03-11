import { DialogProps } from '../DialogView';
import { Dialog } from '../../Dialogs/Dialog';
import { ButtonKeyEventOptions } from '../InputEventHandlers';
import { createFocusableElementProps } from '../FocusableElementProps';
import { withFocusable } from '../FocusableComponent';
import { FocusTarget, setChangeFocusToGraphView } from '../../UIStore/Focus';
import { h, linkEvent } from '../../External';
import { deleteGraphByIndex } from 'UIStore/Graphs';
import { createCancelDialogAction } from 'UIStore/Dialogs';

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
  if (dialogProps.dialog.createdGraphIndex != undefined) { 
    dialogProps.dispatch(deleteGraphByIndex(dialogProps.dialog.createdGraphIndex)); 
  }
  dialogProps.dispatch(createCancelDialogAction(dialogProps.dialogIndex));
  dialogProps.dispatch(setChangeFocusToGraphView());
}