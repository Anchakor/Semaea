import { StoreLib } from "External";
import { objectJoin } from "Common";

/* Focus changing
Focus determines to which area of the application the focus should be changed (for example graph view and dialog (and menu?).
In that area, exactly one HTML element should get the focus to itself (in onComponentUpdate) and dispatch action SetChangeFocusToAction with undefined.
*/

export enum FocusTargetAreas {
  GraphView = 'GraphView',
  Dialog = 'Dialog'
}

export interface State {
  readonly changeFocusTo?: FocusTargetAreas
}
export const defaultState: State = { 
  changeFocusTo: FocusTargetAreas.GraphView
  // TODO previous focus & action for returning focus
};

// Actions:

// SetChangeFocusToAction
export enum ActionType { SetChangeFocusTo = 'SetChangeFocusTo' }
export interface SetChangeFocusToAction extends StoreLib.Action { type: ActionType.SetChangeFocusTo
  changeFocusTo?: FocusTargetAreas
}
export const SetChangeFocusToActionDefault: SetChangeFocusToAction = { type: ActionType.SetChangeFocusTo,
  changeFocusTo: undefined
};
function doSetChangeFocusToAction(state: State, action: SetChangeFocusToAction) {
  const newState: State = { changeFocusTo: action.changeFocusTo };
  return objectJoin<State>(state, newState);
}

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.SetChangeFocusTo:
      return doSetChangeFocusToAction(state, action as SetChangeFocusToAction);
    default:
      return state;
  }
}

