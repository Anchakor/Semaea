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
}

export function createMainDispatchProps(dispatch: Dispatch<StoreState>): MainDispatchProps {
  return {
    dispatch: dispatch,
  };
}