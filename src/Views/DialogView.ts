import { StoreState, DispatchProps, getDispatchProps } from '../UIStore/Main';
import { connect, h,  UIComponent, hf, hc } from '../External';
import { objectJoin, objectJoinExtend, assert, Log } from '../Common';
import { DialogKind, Dialog, DeleteGraphDialog, shouldDialogBeVisible, AddTripleDialog, DialogMenuDialog, DialogSaViewMapping, OpenFileDialog, SaveFileDialog } from '../Dialogs/Dialog';
import { DefaultDialogView } from './Dialogs/DefaultDialogView';
import { DeleteGraphDialogView } from './Dialogs/DeleteGraphDialogView';
import { Component as AddTripleDialogView } from './Dialogs/AddTripleDialogView';
import { DialogMenuDialogView } from './Dialogs/DialogMenuDialogView';
import { getCurrentProps, CurrentProps } from './CurrentProps';
import { OpenFileDialogView } from './Dialogs/OpenFileDialogView';
import { SaveFileDialogView } from './Dialogs/SaveFileDialogView';

/** Factory function for getting the apropriate functional component of a dialog */
function getDialogView(props: Props, dialog: Dialog, dialogIndex: number) {
  const dialogProps: DialogProps<Dialog> = objectJoinExtend(props, { 
    dialogIndex: dialogIndex,
    dialog: dialog
  });
  switch (dialog.kind) {
    case DialogKind.DialogMenu:
      return hf(DialogMenuDialogView, dialogProps as DialogProps<DialogMenuDialog>);
    case DialogKind.DeleteGraph:
      return hf(DeleteGraphDialogView, dialogProps as DialogProps<DeleteGraphDialog>);
    case DialogKind.AddTriple:
      return hc(AddTripleDialogView, dialogProps as DialogProps<AddTripleDialog>);
    case DialogKind.OpenFile:
      return hf(OpenFileDialogView, dialogProps as DialogProps<OpenFileDialog>);
    case DialogKind.SaveFile:
      return hf(SaveFileDialogView, dialogProps as DialogProps<SaveFileDialog>);
    default:
      Log.log('Warning: rendering a default view for a dialog: '+dialogProps.dialog.kind);
      return hf(DefaultDialogView, dialogProps as DialogProps<Dialog>);
  }
}

export interface DialogProps<D extends Dialog> extends Props {
  dialogIndex: number
  dialog: D
}

// View (component):

export interface StateProps extends StoreState {
  current: CurrentProps
  dialogs: Dialog[]
  dialogSaViewMappings: DialogSaViewMapping[]
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props: Props, context?: unknown) { super(props, context); }
  public render() {
    return h('div', {}, this.props.dialogSaViewMappings
      .filter((mapping, i, arr) => mapping.saViewIndex == this.props.current.saViewIndex
        && this.props.dialogs.length > mapping.dialogIndex
        && this.props.dialogs[mapping.dialogIndex]
        && shouldDialogBeVisible(this.props.dialogs[mapping.dialogIndex]))
      .map((mapping, i, arr) => {
        assert(i <= 0, "More than 1 dialog mapped to an SaView");
        return getDialogView(this.props, this.props.dialogs[mapping.dialogIndex], mapping.dialogIndex);
      }));
  }
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => {
    const dialogs = state.dialogs_.dialogs;
    const dialogSaViewMappings = state.dialogs_.viewMappings;
    return objectJoin<StateProps>(state as StateProps, { current: getCurrentProps(state), dialogs: dialogs, dialogSaViewMappings: dialogSaViewMappings });
  },
  getDispatchProps);