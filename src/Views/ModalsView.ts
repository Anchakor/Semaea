import { IComponent } from '../Common';
import { connect, h, StoreLib, UIComponent } from '../External';
import { Model } from '../Model';
import { State as StoreState } from '../UIStore/Main';

// View (functional component):

export interface StateProps extends StoreState {
}
export interface DispatchProps {
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    const x = this.props.modals_.modals.map((modal, i, a) => {
      return h('div', {
        class: 'modal' + ((i + 1 == a.length) ? ' modal-top' : '')
      }, modal.render()); // TODO
    });
    x.push(h('div', {
      class: (this.props.modals_.modals.length > 0) ? 'modalBackground' : ''
    }));
    return h('div', {
        class: 'modals'
      }, x);
  }
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => state,
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
    };
  });



/////////

export function render(model: Model) {
  const x = model.modals.map((modal, i, a) => {
    return h('div', {
      class: 'modal' + ((i + 1 == a.length) ? ' modal-top' : '')
    }, modal.render());
  });
  x.push(h('div', {
    class: (model.modals.length > 0) ? 'modalBackground' : ''
  }));
  return h('div', {
      class: 'modals'
    }, x);
}

export function closeModal(model: Model, modal: IComponent) {
  model.modals = (model.modals).filter((val, ix) => {
      return val != modal;
    });
}
