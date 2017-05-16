import { StoreLib } from '../External';
import * as TestingView from '../Views/TestingView';
import * as Graph from './Graphs';
import * as Modals from './Modals';

export interface State {
  testing: TestingView.State
  graph: Graph.State
  modals: Modals.State
}
const defaultState: State = {
  testing: TestingView.defaultState,
  graph: Graph.defaultState,
  modals: Modals.defaultState
};

// Reducer:

const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  return {
    testing: TestingView.reducer(state.testing, action),
    graph: Graph.reducer(state.graph, action),
    modals: Modals.reducer(state.modals, action)
  }
}

// Store initialization:

export const store = StoreLib.createStore<State>(reducer);

// Other:

export function mapFullStateToProps(state: any) {
  return state;
}