import { SaGraphView } from './Graphs';
import { arrayImmutableSet, objectClone, objectJoin } from '../Common';
import { StoreLib } from '../External';

export const BaseSaViewTypeConst = 'BaseSaView';
export type BaseSaViewType = 'BaseSaView';

export type SaViewType = BaseSaViewType

export interface SaView {
  saGraphViewIndex: number
  originatingView?: number
  type: SaViewType
}

export interface State {
  saViews: SaView[]
  currentSaViewIndex: number
}
export let defaultState: State = { 
  saViews: [{ 
    saGraphViewIndex: 0,
    type: BaseSaViewTypeConst
  }],
  currentSaViewIndex: 0
};

// Actions:

export enum ActionType { ChangeSaViewSaGraphView = 'ChangeSaViewSaGraphView' }
export interface ChangeSaViewSaGraphViewAction extends StoreLib.Action { type: ActionType.ChangeSaViewSaGraphView
  saViewIndex: number
  saGraphViewIndex: number
}
export const createChangeSaViewSaGraphViewAction = (saViewIndex: number, saGraphViewIndex: number): ChangeSaViewSaGraphViewAction => 
  ({ type: ActionType.ChangeSaViewSaGraphView, saViewIndex: saViewIndex, saGraphViewIndex: saGraphViewIndex });
function doChangeSaViewSaGraphViewAction(state: State, action: ChangeSaViewSaGraphViewAction): State {
  return objectJoin(state, { 
    saViews: arrayImmutableSet(state.saViews, action.saViewIndex, 
      objectJoin(state.saViews[action.saViewIndex], { saGraphViewIndex: action.saGraphViewIndex })
    )});
}

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.ChangeSaViewSaGraphView:
      return doChangeSaViewSaGraphViewAction(state, action as ChangeSaViewSaGraphViewAction);
    default:
      return state;
  }
}
