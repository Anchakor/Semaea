import { h } from "../../External";
import { DialogProps, getDialogCancelButton } from "../DialogView";
import { DeleteGraphDialog } from "../../Dialogs/Dialogs";

export function DeleteGraphDialogView(props: DialogProps<DeleteGraphDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    '; Graph to delete index: ', props.dialog.graphToDeleteIndex,
    ' ', getDialogCancelButton(props) ]);
}