import { GraphNode } from "../Graphs/GraphNode";
import { StoreLib } from "../External";
import { createChangeCurrentNodeAction, createChangeSaGraphViewGraphAction, createChangeCurrentGraphNodeByOffsetAction } from '../UIStore/Graphs/SaGraphViews';
import { createShowAlertModalAction } from '../UIStore/Modals';
import { createChangeSaViewSaGraphViewAction } from '../UIStore/SaViews';
import { createCreateDeleteGraphDialogAction, createCreateAddTripleDialogAction } from '../UIStore/Dialogs/BasicGraphDialogs';
import { createCreateDialogMenuDialogAction } from '../UIStore/Dialogs/DialogMenuDialog';
import { createCancelDialogAction } from '../UIStore/Dialogs';
import { createSetChangeFocusToNoneAction, createSetChangeFocusToGraphViewAction, createSetChangeFocusToDialogAction } from '../UIStore/Focus';
import { objectJoin } from "Common";

export interface GraphDispatchProps {
  changeCurrentGraph: (saGraphViewIndex: number, graphIndex: number) => void
  changeCurrentSaGraphView: (saViewIndex: number, saGraphViewIndex: number) => void
  changeCurrentNode: (saGraphViewIndex: number, graphNode: GraphNode) => void
  showAlertModal: (originatingGraphIndex: number, message: string) => void
  createDialogMenuDialog: (originatingSaViewIndex: number) => void
  createDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => void
  createAddTripleDialog: (graphNode: GraphNode, originatingSaViewIndex: number) => void
  cancelDialog: (dialogIndex: number) => void
  changeCurrentGraphNodeByOffset: (saGraphViewIndex: number, offset: number) => void
  acknowledgeFocusChange: () => void
}

export function createGraphDispatchProps(dispatch: <A extends StoreLib.Action>(action: A) => void): GraphDispatchProps {
  return {
    changeCurrentNode: (saGraphViewIndex: number, graphNode: GraphNode) => 
      dispatch(createChangeCurrentNodeAction(saGraphViewIndex, graphNode)),
    changeCurrentSaGraphView: (saViewIndex: number, saGraphViewIndex: number) => 
      dispatch(createChangeSaViewSaGraphViewAction(saViewIndex, saGraphViewIndex)),
    changeCurrentGraph: (saGraphViewIndex: number, graphIndex: number) => 
      dispatch(createChangeSaGraphViewGraphAction(saGraphViewIndex, graphIndex)),
    createDialogMenuDialog: (originatingSaViewIndex: number) => {
      dispatch(createCreateDialogMenuDialogAction(originatingSaViewIndex));
      dispatch(createSetChangeFocusToGraphViewAction());
    },
    showAlertModal: (originatingGraphIndex: number, message: string) => 
      dispatch(createShowAlertModalAction(originatingGraphIndex, message)),
    createDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => {
      dispatch(createCreateDeleteGraphDialogAction(graphIndex, originatingSaViewIndex));
      dispatch(createSetChangeFocusToDialogAction());
    },
    createAddTripleDialog: (graphNode: GraphNode, originatingSaViewIndex: number) => {
      dispatch(createCreateAddTripleDialogAction(graphNode, originatingSaViewIndex))
      dispatch(createSetChangeFocusToDialogAction());
    },
    cancelDialog: (dialogIndex: number) => 
      dispatch(createCancelDialogAction(dialogIndex)),
    changeCurrentGraphNodeByOffset: (saGraphViewIndex: number, offset: number) => 
      dispatch(createChangeCurrentGraphNodeByOffsetAction(saGraphViewIndex, offset)),
    acknowledgeFocusChange: () => 
      dispatch(createSetChangeFocusToNoneAction()),
  };
}