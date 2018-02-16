import { h } from "../../External";
import { DialogProps, getDialogCancelButton } from "../DialogView";
import { DialogMenuDialog } from "../../Dialogs/Dialog";

export function DialogMenuDialogView(props: DialogProps<DialogMenuDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    ' ', getDialogCancelButton(props, () => props.deleteGraph(props.dialog.createdGraphIndex)) ]);
}