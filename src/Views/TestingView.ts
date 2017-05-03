import { State } from './MainView';
import { Component, connect, h, StoreLib, UIStoreLib } from '../External';

export interface TestingViewStateProps {
  x: number
}
export interface TestingViewDispatchProps {
  onSomeUpdate: () => void
}
type TestingViewProps = TestingViewStateProps & TestingViewDispatchProps

export class TestingView extends Component<TestingViewProps, {}> {
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

///////////////////////////////////////

export const TestIncrementStoreActionTypeConst = 'TestIncrementStoreAction';
export type TestIncrementStoreActionType = 'TestIncrementStoreAction';
export interface TestIncrementStoreAction extends StoreLib.Action { type: TestIncrementStoreActionType
  value: number
}
const createTestIncrementStoreAction = () => ({ type: TestIncrementStoreActionTypeConst, value: 1 } as TestIncrementStoreAction);

export const VisibleTestingView = connect(
  TestingView,
  (state: State, ownProps?: {}): TestingViewStateProps => { 
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
