import { StoreLib, $, StoreLibThunk, Dispatch } from '../External';
import * as Graphs from './Graphs';
import * as Modals from './Modals';
import * as SaViews from './SaViews';
import * as Dialogs from './Dialogs';
import * as Focus from './Focus';
import { Log } from 'Common';

export interface StoreState {
  readonly graphs_: Graphs.State
  readonly modals_: Modals.State
  readonly saViews_: SaViews.State
  readonly dialogs_: Dialogs.State
  readonly focus_: Focus.State
}
const defaultState: StoreState = {
  graphs_: Graphs.defaultState,
  modals_: Modals.defaultState,
  saViews_: SaViews.defaultState,
  dialogs_: Dialogs.defaultState,
  focus_: Focus.defaultState
};

export type DispatchProps = {
  dispatch: Dispatch<StoreState>
} 

// Reducer:

const reducer: StoreLib.Reducer<StoreState> = (state: StoreState = defaultState, action: StoreLib.Action) => {
  setTimeout(() => { $('#graph').textContent = JSON.stringify(state); }, 1); // Debug
  Log.debug('Reducing action: '+JSON.stringify(action));

  var newState = Dialogs.reducer(state, action);
  if (newState != state) { return newState; }

  return {
    graphs_: Graphs.reducer(state.graphs_, action),
    modals_: Modals.reducer(state.modals_, action),
    saViews_: SaViews.reducer(state.saViews_, action),
    dialogs_: state.dialogs_,
    focus_: Focus.reducer(state.focus_, action)
  }
}

// Store initialization:

export const store = StoreLib.createStore<StoreState, any, any, any>(reducer, 
  StoreLib.applyMiddleware(StoreLibThunk.default));

// Other:

export function mapFullStateToProps(state: any) {
  return state;
}