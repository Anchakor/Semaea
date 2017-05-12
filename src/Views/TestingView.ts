import { UIComponent, connect, h, StoreLib, UIStoreLib } from '../External';
import { State as StoreState } from '../UIStore/Main';

// State:

export interface State {
  x: number 
}
export const defaultState: State = { x: 10 };

// Actions:

export const TestIncrementStoreActionTypeConst = 'TestIncrementStoreAction';
export type TestIncrementStoreActionType = 'TestIncrementStoreAction';
export interface TestIncrementStoreAction extends StoreLib.Action { type: TestIncrementStoreActionType
  value: number
}
const createTestIncrementStoreAction = () => ({ type: TestIncrementStoreActionTypeConst, value: 1 } as TestIncrementStoreAction);

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: TestIncrementStoreAction) => {
  switch (action.type) {
    case TestIncrementStoreActionTypeConst:
      return Object.assign({}, state, { x: state.x + action.value });
    default:
      return state;
  }
}

// View (functional component):

export interface TestingViewStateProps {
  x: number
}
export interface TestingViewDispatchProps {
  onSomeUpdate: () => void
}
type TestingViewProps = TestingViewStateProps & TestingViewDispatchProps

export class TestingView extends UIComponent<TestingViewProps, {}> {
  constructor(props?: TestingViewProps, context?: any) { super(props, context); }
  public render() {
    setTimeout(() => {
      this.props.onSomeUpdate();
    }, 1000);
    return h('p', {}, [
      h('span', {}, 'counter: '),
      h('span', {}, this.props.x.toString())
    ]);
  }
}

// Component (container component):

export const Component = connect(
  TestingView,
  (state: StoreState, ownProps?: {}): TestingViewStateProps => { 
    return { x: state.testing.x }; 
  },
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): TestingViewDispatchProps => { 
    return {
      onSomeUpdate: () => {
        return dispatch(createTestIncrementStoreAction());
      }
    };
  }
);
