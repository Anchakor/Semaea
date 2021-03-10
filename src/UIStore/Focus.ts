import { StoreLib, UIStoreTools } from "External";
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

const slice = UIStoreTools.createSlice({
  name: 'Focus',
  initialState: defaultState,
  reducers: {
    setChangeFocusTo: (state, action: UIStoreTools.PayloadAction<FocusTarget>) => {
      state.changeFocusTo = action.payload;
    },
    setChangeFocusToGraphView: (state) => {
      state.changeFocusTo = FocusTarget.GraphView;
    },
    setChangeFocusToDialogCancelButton: (state) => {
      state.changeFocusTo = FocusTarget.DialogCancelButton;
    },
    setChangeFocusToGraphFilter: (state) => {
      state.changeFocusTo = FocusTarget.GraphFilter;
    },
    setChangeFocusToNone: (state) => {
      state.changeFocusTo = undefined;
    }
  }
})

export const { setChangeFocusTo,
  setChangeFocusToDialogCancelButton,
  setChangeFocusToGraphFilter,
  setChangeFocusToGraphView,
  setChangeFocusToNone
} = slice.actions;

export const reducer = slice.reducer;
