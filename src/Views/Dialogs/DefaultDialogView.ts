import { h } from "../../External";
import { DialogProps, getDialogCancelButton } from "../DialogView";
import { Dialog } from "../../Dialogs/Dialog";

export function DefaultDialogView(props: DialogProps<Dialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    ' ', getDialogCancelButton(props) ]);
}