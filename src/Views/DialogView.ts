import { StoreState } from '../UIStore/Main';
import { createChangeSaViewAction } from '../UIStore/SaViews';
import { connect, h, StoreLib, UIComponent } from '../External';
import { objectJoin, objectJoinExtend } from '../Common';
import { DialogType, Dialog, DeleteGraphDialog, shouldDialogBeVisible, AddTripleDialog, DialogMenuDialog } from '../Dialogs/Dialogs';
import { DialogSaViewMapping, createCancelDialogAction, createFinishDialogAction } from '../UIStore/Dialogs';
import { DefaultDialogView } from './Dialogs/DefaultDialogView';
import { DeleteGraphDialogView } from './Dialogs/DeleteGraphDialogView';
import { AddTripleDialogView } from './Dialogs/AddTripleDialogView';
import { createAddTripleAction, createDeleteGraphAction } from '../UIStore/Graphs';
import { Triple } from '../Graphs/Triple';
import { DialogMenuDialogView } from 'Views/Dialogs/DialogMenuDialogView';

/** Factory function for getting the apropriate functional component of a dialog */
function getDialogView(props: Props, dialog: Dialog, dialogIndex: number) {
  const saGraphViewIndex = props.saViews_.saViews[props.saViewIndex].saGraphViewIndex;
  const graphIndex = props.graphs_.saGraphViews[saGraphViewIndex].graphIndex;
  const dialogProps: DialogProps<Dialog> = objectJoinExtend(props, { 
    dialogIndex: dialogIndex,
    dialog: dialog,
    saGraphViewIndex: saGraphViewIndex,
    graphIndex: graphIndex
  });
  switch (dialog.type) {
    case DialogType.DialogMenu:
      return h(DialogMenuDialogView, dialogProps);
    case DialogType.DeleteGraph:
      return h(DeleteGraphDialogView, dialogProps);
    case DialogType.AddTriple:
      return h(AddTripleDialogView, dialogProps);
    default:
      return h(DefaultDialogView, dialogProps);
  }
}

export interface DialogProps<D extends Dialog> extends Props {
  dialogIndex: number
  dialog: D
  saGraphViewIndex: number
  graphIndex: number
}

export function getDialogCancelButton(dialogProps: DialogProps<Dialog>, additionalAction?: () => void) {
  return h('button', { 
    onclick: () => { 
      if (additionalAction != undefined) additionalAction();
      dialogProps.cancelDialog(dialogProps.dialogIndex);
    }
  }, 'Cancel')
}

// View (component):

export interface StateProps extends StoreState {
  saViewIndex: number
  dialogs: Dialog[]
  dialogSaViewMappings: DialogSaViewMapping[]
}
export interface DispatchProps {
  cancelDialog: (dialogIndex: number) => void
  finishDialog: (dialogIndex: number) => void
  addTriple: (graphIndex: number, triple: Triple) => void
  deleteGraph: (graphIndex: number) => void
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    return h('div', {}, this.props.dialogSaViewMappings
      .filter((mapping, i, arr) => mapping.saViewIndex == this.props.saViewIndex
        && this.props.dialogs.length > mapping.dialogIndex
        && this.props.dialogs[mapping.dialogIndex]
        && shouldDialogBeVisible(this.props.dialogs[mapping.dialogIndex]))
      .map((mapping, i, arr) => {
        return getDialogView(this.props, this.props.dialogs[mapping.dialogIndex], mapping.dialogIndex);
      }));
  }
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => {
    const saViewIndex = state.saViews_.currentSaViewIndex;
    const dialogs = state.dialogs_.dialogs;
    const dialogSaViewMappings = state.dialogs_.viewMappings;
    return objectJoin<StateProps>(state as StateProps, { saViewIndex: saViewIndex, dialogs: dialogs, dialogSaViewMappings: dialogSaViewMappings });
  },
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      cancelDialog: (dialogIndex: number) => dispatch(createCancelDialogAction(dialogIndex)),
      finishDialog: (dialogIndex: number) => dispatch(createFinishDialogAction(dialogIndex)),
      addTriple: (graphIndex: number, triple: Triple) => dispatch(createAddTripleAction(graphIndex, triple)),
      deleteGraph: (graphIndex: number) => dispatch(createDeleteGraphAction(graphIndex))
    };
  });