import { StoreState, DispatchProps, getDispatchProps } from '../UIStore/Main';
import { changeSaViewToIndex } from '../UIStore/SaViews';
import { connect, h, UIComponent } from '../External';
import { objectJoin } from '../Common';
import { shouldSaViewBeVisible } from '../SaViews';
import { getCurrentProps, CurrentProps } from './CurrentProps';
import { ButtonKeyEventOptions } from './InputEventHandlers';
import { createFocusableElementProps } from './FocusableElementProps';

// View (component):

export interface StateProps extends StoreState {
  current: CurrentProps
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props: Props, context?: unknown) { super(props, context); }
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
          return h('button', createFocusableElementProps(ButtonKeyEventOptions, this.props, { 
            class: tagClass,
            onclick: () => this.props.dispatch(changeSaViewToIndex(saViewIndex)),
          }), saViewIndex.toString())
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
  getDispatchProps);