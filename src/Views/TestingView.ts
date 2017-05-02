import { h, Component, UIStoreLib, StoreLib } from '../External';

export interface TestingViewProps {
  x: number
  onSomeUpdate: () => void
}

export class TestingView extends Component<TestingViewProps, {}> {
  constructor(props?: TestingViewProps, context?: any) { super(props, context); }
  public render() {
    setTimeout(() => {
      this.props.onSomeUpdate();
    }, 1000);
    return h('p', {}, [
      h('span', {}, 'counter: '),
      h('span', {}, this.props.testing.x.toString())
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

export const VisibleTestingView = UIStoreLib.connect(
  (state: any, props?: {}) => { 
    return state; 
  },
  (dispatch: (action: any) => void, props?: {}) => { 
    return {
      onSomeUpdate: () => {
        return dispatch(createTestIncrementStoreAction());
      }
    };
  }
)(TestingView);
