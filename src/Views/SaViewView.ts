import { StoreState } from '../UIStore/Main';
import { createChangeSaViewAction } from '../UIStore/SaViews';
import { connect, h, StoreLib, UIComponent } from '../External';
import { objectJoin } from '../Common';
import { SaView, shouldSaViewBeVisible } from '../SaViews';

// View (component):

export interface StateProps extends StoreState {
  saViewIndex: number
  saViews: SaView[]
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
      ].concat(this.props.saViews.map((saView, saViewIndex) => saViewIndex)
        .filter((saViewIndex) => shouldSaViewBeVisible(saViewIndex, this.props))
        .map((saViewIndex) => {
          let tagClass: string = '';
          if (this.props.saViewIndex == saViewIndex) {
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
    const saViewIndex = state.saViews_.currentSaViewIndex;
    const saViews = state.saViews_.saViews;
    return objectJoin(state as StateProps, { saViewIndex: saViewIndex, saViews: saViews });
  },
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      changeCurrentSaView: (saViewIndex: number) => dispatch(createChangeSaViewAction(saViewIndex))
    };
  });