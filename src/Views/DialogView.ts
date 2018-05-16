import { StoreState } from '../UIStore/Main';
import { createChangeSaViewAction } from '../UIStore/SaViews';
import { connect, h, StoreLib, UIComponent, hf, hc, linkEvent, FunctionalUIComponent } from '../External';
import { objectJoin, objectJoinExtend, assert, Log } from '../Common';
import { DialogType, Dialog, DeleteGraphDialog, shouldDialogBeVisible, AddTripleDialog, DialogMenuDialog, DialogSaViewMapping } from '../Dialogs/Dialog';
import { createCancelDialogAction, createFinishDialogAction } from '../UIStore/Dialogs';
import { DefaultDialogView } from './Dialogs/DefaultDialogView';
import { DeleteGraphDialogView } from './Dialogs/DeleteGraphDialogView';
import { Component as AddTripleDialogView } from './Dialogs/AddTripleDialogView';
import { createAddTripleAction, createDeleteGraphAction } from '../UIStore/Graphs';
import { Triple } from '../Graphs/Triple';
import { DialogMenuDialogView } from './Dialogs/DialogMenuDialogView';
import { createSetChangeFocusToGraphViewAction, createSetChangeFocusToNoneAction, FocusTarget } from '../UIStore/Focus';
import { getCurrentProps, CurrentProps } from './CurrentProps';
import { createMainDispatchProps, MainDispatchProps } from './MainDispatchProps';
import { ButtonKeyEventOptions } from './InputEventHandlers';
import { createFocusableElementProps } from './FocusableElementProps';
import { FocusableComponent } from './FocusableComponent';

/** Factory function for getting the apropriate functional component of a dialog */
function getDialogView(props: Props, dialog: Dialog, dialogIndex: number) {
  const dialogProps: DialogProps<Dialog> = objectJoinExtend(props, { 
    dialogIndex: dialogIndex,
    dialog: dialog
  });
  switch (dialog.type) {
    case DialogType.DialogMenu:
      return hf(DialogMenuDialogView, dialogProps as DialogProps<DialogMenuDialog>);
    case DialogType.DeleteGraph:
      return hf(DeleteGraphDialogView, dialogProps as DialogProps<DeleteGraphDialog>);
    case DialogType.AddTriple:
      return hc(AddTripleDialogView, dialogProps as DialogProps<AddTripleDialog>);
    default:
      return hf(DefaultDialogView, dialogProps as DialogProps<Dialog>);
  }
}

export interface DialogProps<D extends Dialog> extends Props {
  dialogIndex: number
  dialog: D
}

type DialogCancelButtonProps = DialogProps<Dialog> & { additionCancelAction?: () => void }
export class DialogCancelButtonView extends FocusableComponent<DialogCancelButtonProps> {
  constructor(props: DialogCancelButtonProps, context?: any) { super(props, context); }
  readonly innerComponent = DialogCancelButtonViewInner
  readonly focusTarget = FocusTarget.DialogCancelButton
}
function DialogCancelButtonViewInner(dialogProps: DialogCancelButtonProps) {
  return h('button', createFocusableElementProps(ButtonKeyEventOptions, dialogProps, { 
    onclick: linkEvent(dialogProps, cancelDialogButtonOnClickHandler),
  }), 'Cancel')
}
function cancelDialogButtonOnClickHandler(dialogProps: DialogCancelButtonProps, event: Event) {
  if (dialogProps.additionCancelAction != undefined) dialogProps.additionCancelAction();
  dialogProps.cancelDialog(dialogProps.dialogIndex);
}

// View (component):

export interface StateProps extends StoreState {
  current: CurrentProps
  dialogs: Dialog[]
  dialogSaViewMappings: DialogSaViewMapping[]
}
export interface DispatchExtendedProps {
  addTriple: (graphIndex: number, triple: Triple) => void
  deleteGraph: (graphIndex: number) => void
}
type DispatchProps = DispatchExtendedProps & MainDispatchProps
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props: Props, context?: any) { super(props, context); }
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
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return objectJoinExtend(createMainDispatchProps(dispatch), {
      addTriple: (graphIndex: number, triple: Triple) => dispatch(createAddTripleAction(graphIndex, triple)),
      deleteGraph: (graphIndex: number) => dispatch(createDeleteGraphAction(graphIndex))
    });
  });