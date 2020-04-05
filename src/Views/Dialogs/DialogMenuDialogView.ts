import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { DialogMenuDialog } from '../../Dialogs/Dialog';
import { objectJoinExtend, Log } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import * as Key from '../../Key';
import { GraphNode } from '../../Graphs/GraphNode';
import { Graph } from 'Graphs/Graph';

export function DialogMenuDialogView(props: DialogProps<DialogMenuDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.kind, '; Status: ', props.dialog.status,
    ' ', 
    hc(DialogCancelButtonView, props)
  ]);
}

export function dialogMenuDialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type == KeyEventType.keyUp) {
      submitDialog(props);
      event.preventDefault();
    } else {
      event.preventDefault();
    }
    return true;
  }
  return false;
}

export function dialogMenuDialogEntityMouseClickHandler(props: MainProps, event: MouseEvent, graphNode: GraphNode): boolean {
  const currentNode = props.current.saGraphView.currentNode;
  const alreadyIsCurrentNode = (currentNode && graphNode.equals(currentNode));
  if (alreadyIsCurrentNode) { 
    submitDialog(props);
    event.preventDefault();
    return true;
  }
  return false;
}

function submitDialog(props: MainProps) {
  const currentNode = props.current.saGraphView.currentNode;
  const originatingSaViewIndex = props.current.saView.originatingSaViewIndex;
  const dialogIndex = props.current.dialogIndex;
  if (currentNode && dialogIndex != undefined && originatingSaViewIndex != undefined) {
    handleMenuDialogSubmit(props, currentNode, originatingSaViewIndex, dialogIndex);
  }
}

function handleMenuDialogSubmit(props: MainProps, currentNode: GraphNode, originatingSaViewIndex: number, dialogIndex: number) {
  function originatingSaGraphViewIndex(originatingSaViewIndex: number) { 
    return props.saViews_.saViews[originatingSaViewIndex].saGraphViewIndex; 
  }
  function originatingGraphIndex(originatingSaViewIndex: number) { 
    return props.graphs_.saGraphViews[originatingSaGraphViewIndex(originatingSaViewIndex)].graphIndex; 
  }
  function originatingGraph(originatingSaViewIndex: number) { 
    return props.graphs_.graphs[originatingGraphIndex(originatingSaViewIndex)];
  }
  const mappings = [
    { node: 'Add triple', trigger: () => props.createAddTripleDialog(originatingSaViewIndex) },
    { node: 'Delete graph', trigger: () => 
      props.createDeleteGraphDialog(originatingGraphIndex(originatingSaViewIndex), originatingSaViewIndex) },
    { node: 'Open file', trigger: () => props.createOpenFileDialog('.', originatingSaViewIndex) },
    { node: 'Save file', trigger: () => props.createSaveFileDialog('.', originatingSaViewIndex) },
    { node: 'Open current view as a new graph', trigger: () => 
      props.openCurrentViewAsNewGraph(originatingSaViewIndex, 
        originatingGraph(originatingSaViewIndex)?.clone() ?? new Graph()) }
  ];
  const currentGraphIndex = props.current.saGraphView.graphIndex;
  const currentNodeValue = currentNode.getValue();
  const mapping = mappings.find((v) => v.node == currentNodeValue);
  if (mapping) {
    props.deleteGraph(currentGraphIndex)
    props.finishDialog(dialogIndex);
    mapping.trigger();
  } else {
    Log.error("Submitted DialogMenuDialog for a node without a handler: "+currentNode.getValue());
  }
}