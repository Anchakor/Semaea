import { h } from "../../External";
import { DialogProps, getDialogCancelButton } from "../DialogView";
import { DeleteGraphDialog } from "../../Dialogs/Dialogs";

export function DeleteGraphDialogView(props: DialogProps<DeleteGraphDialog>) {
  return h('div', {}, [ 'Delete graph at index: ', props.dialog.graphToDeleteIndex, ' ',
    h('button', {
      onclick: () => {
        props.deleteGraph(props.dialog.graphToDeleteIndex);
        props.finishDialog(props.dialogIndex);
      }
    }, 'Delete'),
    ' ', getDialogCancelButton(props) ]);
}