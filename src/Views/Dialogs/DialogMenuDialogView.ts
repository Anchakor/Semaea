import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { DialogMenuDialog } from '../../Dialogs/Dialog';
import { objectJoinExtend } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions } from '../InputEventHandlers';
import { KeyEventType } from '../DialogEventHandlers';
import * as Key from '../../Key';
import { GraphNode } from 'Graphs/GraphNode';

export function DialogMenuDialogView(props: DialogProps<DialogMenuDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.type, '; Status: ', props.dialog.status,
    ' ', 
    hc(DialogCancelButtonView, objectJoinExtend(props, { additionCancelAction: () => props.deleteGraph(props.dialog.createdGraphIndex) }))
  ]);
}

export function dialogMenuDialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type == KeyEventType.keyUp) {
      const currentNode = props.current.saGraphView.currentNode;
      const originatingSaViewIndex = props.current.saView.originatingSaViewIndex;
      const dialogIndex = props.current.dialogIndex;
      if (currentNode && dialogIndex != undefined && originatingSaViewIndex != undefined) {
        handleMenuDialogSubmit(props, currentNode, originatingSaViewIndex, dialogIndex);
      }
      event.preventDefault();
    } else {
      event.preventDefault();
    }
    return true;
  }
  return false;
}

function handleMenuDialogSubmit(props: MainProps, currentNode: GraphNode, originatingSaViewIndex: number, dialogIndex: number) {
  const mappings = [
    { node: 'Add triple', trigger: () => props.createAddTripleDialog(currentNode, originatingSaViewIndex) },
    { node: 'Delete graph', trigger: () => { 
        const originatingSaGraphViewIndex = props.saViews_.saViews[originatingSaViewIndex].saGraphViewIndex;
        const originatingGraphIndex = props.graphs_.saGraphViews[originatingSaGraphViewIndex].graphIndex;
        props.createDeleteGraphDialog(originatingGraphIndex, originatingSaViewIndex) 
      } },
    { node: 'Open file', trigger: () => props.createOpenFileDialog('.', originatingSaViewIndex) },
  ];
  const currentGraphIndex = props.current.saGraphView.graphIndex;
  const currentNodeValue = currentNode.getValue();
  const mapping = mappings.find((v) => v.node == currentNodeValue);
  if (mapping) {
    props.deleteGraph(currentGraphIndex)
    props.finishDialog(dialogIndex);
    mapping.trigger();
  } else {
    alert("asf "+currentNode.getValue());
  }
}