import { GraphNode } from "../Graphs/GraphNode";
import { StoreLib } from "../External";
import { createChangeCurrentNodeAction, createChangeSaGraphViewGraphAction, createChangeCurrentGraphNodeByOffsetAction } from '../UIStore/Graphs/SaGraphViews';
import { createShowAlertModalAction } from '../UIStore/Modals';
import { createChangeSaViewSaGraphViewAction } from '../UIStore/SaViews';
import { createCreateDeleteGraphDialogAction, createCreateAddTripleDialogAction } from '../UIStore/Dialogs/BasicGraphDialogs';
import { createCreateDialogMenuDialogAction } from '../UIStore/Dialogs/DialogMenuDialog';
import { createCancelDialogAction, createFinishDialogAction } from '../UIStore/Dialogs';
import { createSetChangeFocusToNoneAction, createSetChangeFocusToGraphViewAction, createSetChangeFocusToDialogCancelButtonAction, createSetChangeFocusToGraphFilterAction } from '../UIStore/Focus';
import { createDeleteGraphAction } from '../UIStore/Graphs';
import { createOpenFileDialog } from '../UIStore/Dialogs/OpenFileDialog';

export interface MainDispatchProps {
  changeCurrentGraph: (saGraphViewIndex: number, graphIndex: number) => void
  changeCurrentSaGraphView: (saViewIndex: number, saGraphViewIndex: number) => void
  changeCurrentNode: (saGraphViewIndex: number, graphNode: GraphNode) => void
  showAlertModal: (originatingGraphIndex: number, message: string) => void
  createDialogMenuDialog: (originatingSaViewIndex: number) => void
  createOpenFileDialog: (directoryPath: string, originatingSaViewIndex: number) => void
  createDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => void
  createAddTripleDialog: (graphNode: GraphNode, originatingSaViewIndex: number) => void
  cancelDialog: (dialogIndex: number) => void
  finishDialog: (dialogIndex: number) => void
  changeCurrentGraphNodeByOffset: (saGraphViewIndex: number, offset: number) => void
  acknowledgeFocusChange: () => void
  deleteGraph: (graphIndex: number) => void
}

export function createMainDispatchProps(dispatch: <A extends StoreLib.Action>(action: A) => void): MainDispatchProps {
  return {
    changeCurrentNode: (saGraphViewIndex: number, graphNode: GraphNode) => 
      dispatch(createChangeCurrentNodeAction(saGraphViewIndex, graphNode)),
    changeCurrentSaGraphView: (saViewIndex: number, saGraphViewIndex: number) => 
      dispatch(createChangeSaViewSaGraphViewAction(saViewIndex, saGraphViewIndex)),
    changeCurrentGraph: (saGraphViewIndex: number, graphIndex: number) => 
      dispatch(createChangeSaGraphViewGraphAction(saGraphViewIndex, graphIndex)),
    createDialogMenuDialog: (originatingSaViewIndex: number) => {
      dispatch(createCreateDialogMenuDialogAction(originatingSaViewIndex));
      dispatch(createSetChangeFocusToGraphFilterAction());
    },
    createOpenFileDialog: (directoryPath: string, originatingSaViewIndex: number) => {
      createOpenFileDialog(directoryPath, originatingSaViewIndex)(dispatch);
    },
    showAlertModal: (originatingGraphIndex: number, message: string) => 
      dispatch(createShowAlertModalAction(originatingGraphIndex, message)),
    createDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => {
      dispatch(createCreateDeleteGraphDialogAction(graphIndex, originatingSaViewIndex));
      dispatch(createSetChangeFocusToDialogCancelButtonAction());
    },
    createAddTripleDialog: (graphNode: GraphNode, originatingSaViewIndex: number) => {
      dispatch(createCreateAddTripleDialogAction(graphNode, originatingSaViewIndex));
      dispatch(createSetChangeFocusToDialogCancelButtonAction());
    },
    cancelDialog: (dialogIndex: number) => {
      dispatch(createCancelDialogAction(dialogIndex));
      dispatch(createSetChangeFocusToGraphViewAction());
    },
    finishDialog: (dialogIndex: number) => {
      dispatch(createFinishDialogAction(dialogIndex));
      dispatch(createSetChangeFocusToGraphViewAction());
    },
    changeCurrentGraphNodeByOffset: (saGraphViewIndex: number, offset: number) => {
      dispatch(createChangeCurrentGraphNodeByOffsetAction(saGraphViewIndex, offset));
      dispatch(createSetChangeFocusToGraphViewAction());
    },
    acknowledgeFocusChange: () => 
      dispatch(createSetChangeFocusToNoneAction()),
    deleteGraph: (graphIndex: number) => 
      dispatch(createDeleteGraphAction(graphIndex)),
  };
}