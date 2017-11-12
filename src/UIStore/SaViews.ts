import { arrayImmutableSet, objectClone, objectJoin } from '../Common';
import { StoreLib } from '../External';

export const BaseSaViewTypeConst = 'BaseSaView';
export type BaseSaViewType = 'BaseSaView';

export type SaViewType = BaseSaViewType

export interface SaView {
  graphIndex: number
  originatingView?: number
  type: SaViewType
}

export interface State {
  saViews: SaView[]
  currentSaViewIndex: number
}
export let defaultState: State = { 
  saViews: [{ 
    graphIndex: 0,
    type: BaseSaViewTypeConst
  }],
  currentSaViewIndex: 0
};

// Actions:

// ChangeSaViewGraphAction
export const ChangeSaViewGraphActionTypeConst = 'ChangeSaViewGraphAction';
export type ChangeSaViewGraphActionType = 'ChangeSaViewGraphAction';
export interface ChangeSaViewGraphAction extends StoreLib.Action { type: ChangeSaViewGraphActionType
  saViewIndex: number
  graphIndex: number
}
export const createChangeSaViewGraphAction = (saViewIndex: number, graphIndex: number): ChangeSaViewGraphAction => 
  ({ type: ChangeSaViewGraphActionTypeConst, saViewIndex: saViewIndex, graphIndex: graphIndex });
function doChangeSaViewGraphAction(state: State, action: ChangeSaViewGraphAction): State {
  return objectJoin(state, { 
    saViews: arrayImmutableSet(state.saViews, action.saViewIndex, 
      objectJoin(state.saViews[action.saViewIndex], { graphIndex: action.graphIndex })
    )});
}

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case ChangeSaViewGraphActionTypeConst:
      return doChangeSaViewGraphAction(state, action as ChangeSaViewGraphAction);
    default:
      return state;
  }
}
