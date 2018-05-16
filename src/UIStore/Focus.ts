import { StoreLib } from "External";
import { objectJoin } from "Common";

/* Focus changing
Focus determines to which area of the application the focus should be changed (for example graph view and dialog (and menu?).
In that area, exactly one HTML element should get the focus to itself (in onComponentUpdate) and dispatch action SetChangeFocusToAction with undefined.
*/

export enum FocusTarget {
  GraphView = 'GraphView',
  DialogCancelButton = 'DialogCancelButton',
  GraphFilter = 'GraphFilter'
}

export interface State {
  readonly changeFocusTo?: FocusTarget
}
export const defaultState: State = { 
  changeFocusTo: FocusTarget.GraphView
  // TODO previous focus & action for returning focus (or focus per view?)
};

// Actions:

// SetChangeFocusToAction
export enum ActionType { SetChangeFocusTo = 'SetChangeFocusTo' }
export interface SetChangeFocusToAction extends StoreLib.Action { type: ActionType.SetChangeFocusTo
  changeFocusTo?: FocusTarget
}
export const createSetChangeFocusToAction = (partialAction: Partial<SetChangeFocusToAction>) => objectJoin<SetChangeFocusToAction>({ type: ActionType.SetChangeFocusTo,
  changeFocusTo: undefined
}, partialAction);
export const createSetChangeFocusToGraphViewAction = () => createSetChangeFocusToAction({ changeFocusTo: FocusTarget.GraphView });
export const createSetChangeFocusToDialogCancelButtonAction = () => createSetChangeFocusToAction({ changeFocusTo: FocusTarget.DialogCancelButton });
export const createSetChangeFocusToGraphFilterAction = () => createSetChangeFocusToAction({ changeFocusTo: FocusTarget.GraphFilter });
export const createSetChangeFocusToNoneAction = () => createSetChangeFocusToAction({ changeFocusTo: undefined });
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

