import { StoreState } from '../UIStore/Main';
import { createChangeSaViewAction } from '../UIStore/SaViews';
import { connect, h, StoreLib, UIComponent } from '../External';
import { objectJoin } from '../Common';
import { SaView, shouldSaViewBeVisible } from '../SaViews';
import { getCurrentProps, CurrentProps } from './CurrentProps';

// View (component):

export interface StateProps extends StoreState {
  current: CurrentProps
}
export interface DispatchProps {
  changeCurrentSaView: (saViewIndex: number) => void
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    return h('div', {}, [
      this.renderSaViewSwitchingBar(),
    ]);
  }

  private renderSaViewSwitchingBar() {
    return h('div', {}, [
      h('span', {}, "Views: ")
      ].concat(this.props.saViews_.saViews.map((saView, saViewIndex) => saViewIndex)
        .filter((saViewIndex) => shouldSaViewBeVisible(saViewIndex, this.props))
        .map((saViewIndex) => {
          let tagClass: string = '';
          if (this.props.current.saViewIndex == saViewIndex) {
            tagClass = 'element-selected'
          }
          return h('button', { 
            class: tagClass,
            onclick: () => this.props.changeCurrentSaView(saViewIndex)
          }, saViewIndex.toString())
        })
      )
    );
  }
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => {
    return objectJoin<StateProps>(state as StateProps, { current: getCurrentProps(state) });
  },
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      changeCurrentSaView: (saViewIndex: number) => dispatch(createChangeSaViewAction(saViewIndex))
    };
  });