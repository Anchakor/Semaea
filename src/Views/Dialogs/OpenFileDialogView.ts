import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { OpenFileDialog } from '../../Dialogs/Dialog';
import { objectJoinExtend } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions } from '../InputEventHandlers';
import * as Key from '../../Key';
import { GraphNode } from 'Graphs/GraphNode';
import { DialogCancelButtonView } from './DialogCancelButtonView';

export function OpenFileDialogView(props: DialogProps<OpenFileDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    ' ', 
    hc(DialogCancelButtonView, objectJoinExtend(props, { additionCancelAction: () => props.deleteGraph(props.dialog.createdGraphIndex) }))
  ]);
}