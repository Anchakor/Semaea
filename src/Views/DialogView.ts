import { StoreState } from '../UIStore/Main';
import { SaView, createChangeSaViewAction } from '../UIStore/SaViews';
import { connect, h, StoreLib, UIComponent } from '../External';
import { objectJoin, objectJoinExtend } from '../Common';
import { DialogType, Dialog } from '../Dialogs/Dialogs';
import { DialogSaViewMapping } from '../UIStore/Dialogs';

/** Factory function for getting the apropriate functional component of a modal */
function getModalView(props: Props, dialog: Dialog) {
  const dialogProps = objectJoinExtend(props, { 
    dialog: dialog
  });
  switch (dialog.type) {
    case DialogType.DeleteGraph:
      return h('div', {}, [ dialog.type, ' TEST ', dialog.status ]); // TODO
      //return AlertModalView(modalProps as any);
    default:
    return h('div', {}, [ dialog.type, ' ', dialog.status ]);
  }
}

// View (component):

export interface StateProps extends StoreState {
  saViewIndex: number
  dialogs: Dialog[]
  dialogSaViewMappings: DialogSaViewMapping[]
}
export interface DispatchProps {
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    return h('div', {}, this.props.dialogSaViewMappings
      .filter((mapping, i, arr) => mapping.saViewIndex == this.props.saViewIndex)
      .map((mapping, i, arr) => {
        return getModalView(this.props, this.props.dialogs[mapping.dialogIndex]);
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
    };
  });