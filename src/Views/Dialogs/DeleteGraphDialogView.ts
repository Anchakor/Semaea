import { h, hc } from '../../External';
import { DialogProps, DialogCancelButtonView } from '../DialogView';
import { DeleteGraphDialog } from '../../Dialogs/Dialog';

export function DeleteGraphDialogView(props: DialogProps<DeleteGraphDialog>) {
  return h('div', {}, [ 'Delete graph at index: ', props.dialog.graphToDeleteIndex, ' ',
    h('button', {
      onclick: () => {
        props.deleteGraph(props.dialog.graphToDeleteIndex);
        props.finishDialog(props.dialogIndex);
      }
    }, 'Delete'),
    ' ', hc(DialogCancelButtonView, props) ]);
}