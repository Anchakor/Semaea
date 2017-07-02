import { StoreLib } from '../External';
import * as TestingView from '../Views/TestingView';
import * as Graphs from './Graphs';
import * as Modals from './Modals';

export interface State {
  testing: TestingView.State
  graphs: Graphs.State
  modals: Modals.State
}
const defaultState: State = {
  testing: TestingView.defaultState,
  graphs: Graphs.defaultState,
  modals: Modals.defaultState
};

// Reducer:

const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  return {
    testing: TestingView.reducer(state.testing, action),
    graphs: Graphs.reducer(state.graphs, action),
    modals: Modals.reducer(state.modals, action)
  }
}

// Store initialization:

export const store = StoreLib.createStore<State>(reducer);

// Other:

export function mapFullStateToProps(state: any) {
  return state;
}