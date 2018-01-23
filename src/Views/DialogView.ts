import { StoreState } from '../UIStore/Main';
import { createChangeSaViewAction } from '../UIStore/SaViews';
import { connect, h, StoreLib, UIComponent } from '../External';
import { objectJoin, objectJoinExtend } from '../Common';
import { DialogType, Dialog, DeleteGraphDialog, shouldDialogBeVisible, AddTripleDialog } from '../Dialogs/Dialogs';
import { DialogSaViewMapping, createCancelDialogAction } from '../UIStore/Dialogs';
import { DefaultDialogView } from './Dialogs/DefaultDialogView';
import { DeleteGraphDialogView } from './Dialogs/DeleteGraphDialogView';
import { AddTripleDialogView } from './Dialogs/AddTripleDialogView';
import { InfernoChildren } from 'inferno/core/VNodes';

/** Factory function for getting the apropriate functional component of a dialog */
function getDialogView(props: Props, dialog: Dialog, dialogIndex: number) {
  const dialogProps = objectJoinExtend(props, { 
    dialogIndex: dialogIndex,
    dialog: dialog
  });
  switch (dialog.type) {
    case DialogType.DeleteGraph:
      return DeleteGraphDialogView(dialogProps as DialogProps<DeleteGraphDialog>);
    case DialogType.AddTriple:
      return h(AddTripleDialogView, dialogProps as DialogProps<AddTripleDialog>);
    default:
      return DefaultDialogView(dialogProps);
  }
}

export interface DialogProps<D extends Dialog> extends Props {
  dialogIndex: number
  dialog: D
}

export function getDialogCancelButton(dialogProps: DialogProps<Dialog>) {
  return h('button', { 
    onclick: () => dialogProps.cancelDialog(dialogProps.dialogIndex)
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
    return objectJoin(state as StateProps, { saViewIndex: saViewIndex, dialogs: dialogs, dialogSaViewMappings: dialogSaViewMappings });
  },
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      cancelDialog: (dialogIndex: number) => dispatch(createCancelDialogAction(dialogIndex))
    };
  });