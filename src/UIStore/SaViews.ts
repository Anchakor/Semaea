import { SaGraphView } from './Graphs';
import { arrayImmutableSet, objectClone, objectJoin } from '../Common';
import { StoreLib } from '../External';
import { SaView } from '../SaViews';

/* SaViews
SaViews are the Semaea Views, the main UI views user can switch between
SaViews 0..* - 0..1 Dialogs
SaViews 0..* - 0..1 SaGraphViews
*/

export interface State {
  readonly saViews: SaView[]
  readonly currentSaViewIndex: number
}
export const defaultState: State = { 
  saViews: [{ 
    saGraphViewIndex: 0
  }],
  currentSaViewIndex: 0
};

// Actions:

// ChangeSaViewAction
export enum ActionType { ChangeSaView = 'ChangeSaView' }
export interface ChangeSaViewAction extends StoreLib.Action { type: ActionType.ChangeSaView
  saViewIndex: number
}
export const createChangeSaViewAction = (saViewIndex: number): ChangeSaViewAction => 
  ({ type: ActionType.ChangeSaView, saViewIndex: saViewIndex });
function doChangeSaViewAction(state: State, action: ChangeSaViewAction) {
  return objectJoin<State>(state, { currentSaViewIndex: action.saViewIndex });
}
//-dispatch:
//ChangeSaView: (saViewIndex: number) => dispatch(createChangeSaViewAction(saViewIndex))

// ChangeSaViewSaGraphViewAction
export enum ActionType { ChangeSaViewSaGraphView = 'ChangeSaViewSaGraphView' }
export interface ChangeSaViewSaGraphViewAction extends StoreLib.Action { type: ActionType.ChangeSaViewSaGraphView
  saViewIndex: number
  saGraphViewIndex: number
}
export const createChangeSaViewSaGraphViewAction = (saViewIndex: number, saGraphViewIndex: number): ChangeSaViewSaGraphViewAction => 
  ({ type: ActionType.ChangeSaViewSaGraphView, saViewIndex: saViewIndex, saGraphViewIndex: saGraphViewIndex });
export function doChangeSaViewSaGraphViewAction(state: State, action: ChangeSaViewSaGraphViewAction): State {
  return objectJoin(state, { 
    saViews: arrayImmutableSet(state.saViews, action.saViewIndex, 
      objectJoin(state.saViews[action.saViewIndex], { saGraphViewIndex: action.saGraphViewIndex })
    )});
}

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.ChangeSaView:
      return doChangeSaViewAction(state, action as ChangeSaViewAction);
    case ActionType.ChangeSaViewSaGraphView:
      return doChangeSaViewSaGraphViewAction(state, action as ChangeSaViewSaGraphViewAction);
    default:
      return state;
  }
}
