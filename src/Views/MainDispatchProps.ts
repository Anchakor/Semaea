import { GraphNode } from '../Graphs/GraphNode';
import { StoreLib, StoreLibThunk, Dispatch } from '../External';
import { createChangeCurrentNodeAction, createChangeSaGraphViewGraphAction, createChangeCurrentGraphNodeByOffsetAction, createChangeCurrentGraphNodeHorizontallyByOffsetAction } from '../UIStore/Graphs/SaGraphViews';
import { createShowAlertModalAction } from '../UIStore/Modals';
import { createChangeSaViewSaGraphViewAction } from '../UIStore/SaViews';
import { createCreateDeleteGraphDialogAction, createCreateAddTripleDialogAction } from '../UIStore/Dialogs/BasicGraphDialogs';
import { createCreateDialogMenuDialogAction } from '../UIStore/Dialogs/DialogMenuDialog';
import { createCancelDialogAction, createFinishDialogAction } from '../UIStore/Dialogs';
import { createSetChangeFocusToNoneAction, createSetChangeFocusToGraphViewAction, createSetChangeFocusToDialogCancelButtonAction, createSetChangeFocusToGraphFilterAction } from '../UIStore/Focus';
import { createDeleteGraphAction } from '../UIStore/Graphs';
import { createOpenFileDialog, openFileDialogOpenFile, openCurrentViewAsNewGraph } from '../UIStore/Dialogs/OpenFileDialog';
import { changeFileDialogDirectory } from '../UIStore/Dialogs/FileDialogCommon';
import { saveFileDialogSaveFile, createSaveFileDialog } from '../UIStore/Dialogs/SaveFileDialog';
import { Graph } from '../Graphs/Graph';
import { StoreState, DispatchProps } from 'UIStore/Main';

export interface MainDispatchProps extends DispatchProps {
  changeCurrentGraph: (saGraphViewIndex: number, graphIndex: number) => void
  changeCurrentSaGraphView: (saViewIndex: number, saGraphViewIndex: number) => void
  changeCurrentNode: (saGraphViewIndex: number, graphNode: GraphNode) => void
  showAlertModal: (originatingGraphIndex: number, message: string) => void
  createDialogMenuDialog: (originatingSaViewIndex: number) => void
  createOpenFileDialog: (directoryPath: string, originatingSaViewIndex: number) => void
  createSaveFileDialog: (directoryPath: string, originatingSaViewIndex: number) => void
  openCurrentViewAsNewGraph: (originatingSaViewIndex: number, graph: Graph) => void
  changeFileDialogDirectory: (dialogIndex: number, directoryPath: string) => void
  openFileDialogOpenFile: (dialogIndex: number, filePath: string, originatingSaViewIndex: number) => void
  saveFileDialogSaveFile: (dialogIndex: number, filePath: string, graph: Graph) => void
  createDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => void
  createAddTripleDialog: (originatingSaViewIndex: number) => void
  cancelDialog: (dialogIndex: number, createdGraphIndex?: number) => void
  finishDialog: (dialogIndex: number) => void
  changeCurrentGraphNodeByOffset: (saGraphViewIndex: number, offset: number) => void
  changeCurrentGraphNodeHorizontallyByOffset: (saGraphViewIndex: number, offset: number) => void
  focusGraphView: () => void
  acknowledgeFocusChange: () => void
  deleteGraph: (graphIndex: number) => void
}

export function createMainDispatchProps(dispatch: Dispatch<StoreState>): MainDispatchProps {
  return {
    dispatch: dispatch,
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
      dispatch(createSetChangeFocusToGraphFilterAction());
    },
    createSaveFileDialog: (directoryPath: string, originatingSaViewIndex: number) => {
      createSaveFileDialog(directoryPath, originatingSaViewIndex)(dispatch);
      dispatch(createSetChangeFocusToGraphFilterAction());
    },
    openCurrentViewAsNewGraph: (originatingSaViewIndex: number, graph: Graph) => {
      openCurrentViewAsNewGraph(originatingSaViewIndex, graph)(dispatch);
    },
    changeFileDialogDirectory: (dialogIndex: number, directoryPath: string) => {
      changeFileDialogDirectory(dialogIndex, directoryPath)(dispatch);
      dispatch(createSetChangeFocusToGraphFilterAction());
    },
    openFileDialogOpenFile: (dialogIndex: number, filePath: string, originatingSaViewIndex: number) => {
      openFileDialogOpenFile(dialogIndex, filePath, originatingSaViewIndex)(dispatch);
    },
    saveFileDialogSaveFile: (dialogIndex: number, filePath: string, graph: Graph) => {
      saveFileDialogSaveFile(dialogIndex, filePath, graph)(dispatch);
    },
    showAlertModal: (originatingGraphIndex: number, message: string) => 
      dispatch(createShowAlertModalAction(originatingGraphIndex, message)),
    createDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => {
      dispatch(createCreateDeleteGraphDialogAction(graphIndex, originatingSaViewIndex));
      dispatch(createSetChangeFocusToDialogCancelButtonAction());
    },
    createAddTripleDialog: (originatingSaViewIndex: number) => {
      dispatch(createCreateAddTripleDialogAction(originatingSaViewIndex));
      dispatch(createSetChangeFocusToDialogCancelButtonAction());
    },
    cancelDialog: (dialogIndex: number, createdGraphIndex?: number) => {
      if (createdGraphIndex != undefined) { dispatch(createDeleteGraphAction(createdGraphIndex)); }
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
    changeCurrentGraphNodeHorizontallyByOffset: (saGraphViewIndex: number, offset: number) => {
      dispatch(createChangeCurrentGraphNodeHorizontallyByOffsetAction(saGraphViewIndex, offset));
      dispatch(createSetChangeFocusToGraphViewAction());
    },
    focusGraphView: () => 
      dispatch(createSetChangeFocusToGraphViewAction()),
    acknowledgeFocusChange: () => 
      dispatch(createSetChangeFocusToNoneAction()),
    deleteGraph: (graphIndex: number) => 
      dispatch(createDeleteGraphAction(graphIndex)),
  };
}