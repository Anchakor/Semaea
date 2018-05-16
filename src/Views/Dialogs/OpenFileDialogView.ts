import { h, hc } from '../../External';
import { DialogProps, DialogCancelButtonView } from '../DialogView';
import { OpenFileDialog } from '../../Dialogs/Dialog';
import { objectJoinExtend } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions } from '../InputEventHandlers';
import { KeyEventType } from '../DialogEventHandlers';
import * as Key from '../../Key';
import { GraphNode } from 'Graphs/GraphNode';

export function OpenFileDialogView(props: DialogProps<OpenFileDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    ' ', 
    hc(DialogCancelButtonView, objectJoinExtend(props, { additionCancelAction: () => props.deleteGraph(props.dialog.createdGraphIndex) }))
  ]);
}