import { h, hc } from '../../External';
import { DialogProps, DialogCancelButtonView } from '../DialogView';
import { DialogMenuDialog } from '../../Dialogs/Dialog';
import { objectJoinExtend } from 'Common';

export function DialogMenuDialogView(props: DialogProps<DialogMenuDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    ' ', 
    hc(DialogCancelButtonView, objectJoinExtend(props, { additionCancelAction: () => props.deleteGraph(props.dialog.createdGraphIndex) })) 
  ]);
}