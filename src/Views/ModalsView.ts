import { objectJoinExtend } from '../Common';
import { connect, h, UIComponent } from '../External';
import { StoreState, getDispatchProps, DispatchProps } from '../UIStore/Main';
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

export type Props = StoreState & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props: Props, context?: unknown) { super(props, context); }
  public render() {
    const x = this.props.modals_.modals.map((modal, i, a) => {
      return h('div', { 
        style: 'border: 1px dotted; padding: 0.3em;'
      }, [ 
        getModalView(this.props, modal, i),
        h('span', {
          style: 'border: 1px dotted; padding: 0.3em;',
          onclick: () => this.props.dispatch(Modals.createCloseModalAction(i))
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
  getDispatchProps);
