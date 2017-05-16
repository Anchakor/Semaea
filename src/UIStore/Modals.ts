import { StoreLib } from "../External";

export type Modals = any

export interface State {
  modals: Modals[]
}
export const defaultState: State = {
  modals: []
}

// Actions:

// Reducers:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  switch (action.type) {
    default:
      return state;
  }
}

