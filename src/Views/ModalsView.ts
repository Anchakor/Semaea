import { IComponent, objectJoin, objectJoinExtend } from '../Common';
import { connect, h, StoreLib, UIComponent } from '../External';
import { StoreState } from '../UIStore/Main';
import * as Modals from '../UIStore/Modals';
import { AlertModalView } from "../Views/Modals/AlertModalView";

/** Factory function for getting the apropriate functional component of a modal */
function getModalView(props: Props, modal: Modals.Modal, modalIndex: number) {
  const modalProps = objectJoinExtend(props, { 
    modalIndex: modalIndex,
    modal: modal
  });
  switch (modal.type) {
    case Modals.ModalType.AlertModal:
      return AlertModalView(modalProps as ModalProp<Modals.AlertModal>);
    default:
      return h('div');
  }
}

export interface ModalProp<M extends Modals.Modal> extends Props {
  modalIndex: number
  modal: M
}

// View (component):

export interface StateProps extends StoreState {
}
export interface DispatchProps {
  closeModal: (modalIndex: number) => void
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props: Props, context?: any) { super(props, context); }
  public render() {
    const x = this.props.modals_.modals.map((modal, i, a) => {
      return h('div', { 
        style: 'border: 1px dotted; padding: 0.3em;'
      }, [ 
        getModalView(this.props, modal, i),
        h('span', {
          style: 'border: 1px dotted; padding: 0.3em;',
          onclick: () => this.props.closeModal(i)
        }, 'X')
      ]); // TODO
    });
    if (this.props.modals_.modals.length > 0) {
      x.push(h('hr', {}));
    }
    return h('div', {}, x);
  }
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => state,
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      closeModal: (modalIndex: number) => dispatch(Modals.createCloseModalAction(modalIndex)),
    };
  });
