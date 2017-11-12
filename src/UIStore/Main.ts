import { SaView } from './SaViews';
import { StoreLib } from '../External';
import * as TestingView from '../Views/TestingView';
import * as Graphs from './Graphs';
import * as Modals from './Modals';
import * as SaViews from './SaViews';

export interface State {
  testing_: TestingView.State
  graphs_: Graphs.State
  modals_: Modals.State
  saViews_: SaViews.State
}
const defaultState: State = {
  testing_: TestingView.defaultState,
  graphs_: Graphs.defaultState,
  modals_: Modals.defaultState,
  saViews_: SaViews.defaultState
};

// Reducer:

const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  return {
    testing_: TestingView.reducer(state.testing_, action),
    graphs_: Graphs.reducer(state.graphs_, action),
    modals_: Modals.reducer(state.modals_, action),
    saViews_: SaViews.reducer(state.saViews_, action)
  }
}

// Store initialization:

export const store = StoreLib.createStore<State>(reducer);

// Other:

export function mapFullStateToProps(state: any) {
  return state;
}