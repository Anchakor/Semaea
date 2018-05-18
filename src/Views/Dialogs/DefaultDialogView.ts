import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { Dialog } from '../../Dialogs/Dialog';
import { DialogCancelButtonView } from './DialogCancelButtonView';

export function DefaultDialogView(props: DialogProps<Dialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.kind, '; Status: ', props.dialog.status,
    ' ', hc(DialogCancelButtonView, props) ]);
}