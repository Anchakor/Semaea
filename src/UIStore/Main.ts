import { StoreLib } from '../External';
import * as TestingView from '../Views/TestingView';
import * as Graph from './Graph';

export interface State {
  testing: TestingView.State
  graph: Graph.State
}
const defaultState: State = {
  testing: TestingView.defaultState,
  graph: Graph.defaultState
};

// Reducer:

const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  return {
    testing: TestingView.reducer(state.testing, action),
    graph: Graph.reducer(state.graph, action)
  }
}

// Store initialization:

export const store = StoreLib.createStore<State>(reducer);

// Other:

export function mapFullStateToProps(state: any) {
  return state;
}