import { h, hc } from '../../External';
import { DialogProps, DialogCancelButtonView } from '../DialogView';
import { Dialog } from '../../Dialogs/Dialog';

export function DefaultDialogView(props: DialogProps<Dialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    ' ', hc(DialogCancelButtonView, props) ]);
}