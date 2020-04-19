import { h, hc, Dispatch } from '../../External';
import { DialogProps } from '../DialogView';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { DialogMenuDialog } from '../../Dialogs/Dialog';
import { objectJoinExtend, Log } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import * as Key from '../../Key';
import { GraphNode } from '../../Graphs/GraphNode';
import { Graph } from '../../Graphs/Graph';
import { CurrentProps, getCurrentProps } from '../CurrentProps';
import { StoreState } from '../../UIStore/Main';
import { createCreateAddTripleDialogAction, createCreateDeleteGraphDialogAction } from '../../UIStore/Dialogs/BasicGraphDialogs';
import { createSetChangeFocusToDialogCancelButtonAction, createSetChangeFocusToGraphFilterAction, createSetChangeFocusToGraphViewAction } from '../../UIStore/Focus';
import { createOpenFileDialog, openCurrentViewAsNewGraph } from '../../UIStore/Dialogs/OpenFileDialog';
import { createSaveFileDialog } from '../../UIStore/Dialogs/SaveFileDialog';
import { createDeleteGraphAction } from '../../UIStore/Graphs';
import { createFinishDialogAction } from '../../UIStore/Dialogs';

export function DialogMenuDialogView(props: DialogProps<DialogMenuDialog>) {
  return h('div', {}, [ 'Dialog type: ', props.dialog.kind, '; Status: ', props.dialog.status,
    ' ', 
    hc(DialogCancelButtonView, props)
  ]);
}

export function dialogMenuDialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type == KeyEventType.keyUp) {
      submitDialogOLD(props);
      event.preventDefault();
    } else {
      event.preventDefault();
    }
    return true;
  }
  return false;
}

export function dialogMenuDialogEntityMouseClickHandler(dispatch: Dispatch<StoreState>, getState: () => StoreState, event: MouseEvent, graphNode: GraphNode): boolean {
  const current = getCurrentProps(getState());
  const currentNode = current.saGraphView.currentNode;
  const alreadyIsCurrentNode = (currentNode && graphNode.equals(currentNode));
  if (alreadyIsCurrentNode) { 
    submitDialog(dispatch, getState);
    event.preventDefault();
    return true;
  }
  return false;
}

function submitDialog(dispatch: Dispatch<StoreState>, getState: () => StoreState) {
  const current = getCurrentProps(getState());
  const currentNode = current.saGraphView.currentNode;
  const originatingSaViewIndex = current.saView.originatingSaViewIndex;
  const dialogIndex = current.dialogIndex;
  if (currentNode && dialogIndex != undefined && originatingSaViewIndex != undefined) {
    handleMenuDialogSubmit(dispatch, getState, currentNode, originatingSaViewIndex, dialogIndex);
  }
}
function submitDialogOLD(props: MainProps) {
  const currentNode = props.current.saGraphView.currentNode;
  const originatingSaViewIndex = props.current.saView.originatingSaViewIndex;
  const dialogIndex = props.current.dialogIndex;
  if (currentNode && dialogIndex != undefined && originatingSaViewIndex != undefined) {
    Log.log("TODO handleMenuDialogSubmit")
    //handleMenuDialogSubmit(props, currentNode, originatingSaViewIndex, dialogIndex);
  }
}

function handleMenuDialogSubmit(dispatch: Dispatch<StoreState>, getState: () => StoreState, currentNode: GraphNode, originatingSaViewIndex: number, dialogIndex: number) {
  const state = getState();
  const current = getCurrentProps(state);
  function originatingSaGraphViewIndex(originatingSaViewIndex: number) { 
    return state.saViews_.saViews[originatingSaViewIndex].saGraphViewIndex; 
  }
  function originatingGraphIndex(originatingSaViewIndex: number) { 
    return state.graphs_.saGraphViews[originatingSaGraphViewIndex(originatingSaViewIndex)].graphIndex; 
  }
  function originatingGraph(originatingSaViewIndex: number) { 
    return state.graphs_.graphs[originatingGraphIndex(originatingSaViewIndex)];
  }
  const mappings = [
    { node: 'Add triple', trigger: () => {
      dispatch(createCreateAddTripleDialogAction(originatingSaViewIndex));
      dispatch(createSetChangeFocusToDialogCancelButtonAction());
    } },
    { node: 'Delete graph', trigger: () => {
      dispatch(createCreateDeleteGraphDialogAction(originatingGraphIndex(originatingSaViewIndex), originatingSaViewIndex));
      dispatch(createSetChangeFocusToDialogCancelButtonAction());
    } },
    { node: 'Open file', trigger: () => {
      createOpenFileDialog('.', originatingSaViewIndex)(dispatch);
      dispatch(createSetChangeFocusToGraphFilterAction());
    } },
    { node: 'Save file', trigger: () => {
      createSaveFileDialog('.', originatingSaViewIndex)(dispatch);
      dispatch(createSetChangeFocusToGraphFilterAction());
    } },
    { node: 'Open current view as a new graph', trigger: () => {
      openCurrentViewAsNewGraph(originatingSaViewIndex, 
        originatingGraph(originatingSaViewIndex)?.clone() ?? new Graph())(dispatch);
    } }
  ];
  const currentGraphIndex = current.saGraphView.graphIndex;
  const currentNodeValue = currentNode.getValue();
  const mapping = mappings.find((v) => v.node == currentNodeValue);
  if (mapping) {
    dispatch(createDeleteGraphAction(currentGraphIndex));
    dispatch(createFinishDialogAction(dialogIndex));
    dispatch(createSetChangeFocusToGraphViewAction());
    mapping.trigger();
  } else {
    Log.error("Submitted DialogMenuDialog for a node without a handler: "+currentNode.getValue());
  }
}