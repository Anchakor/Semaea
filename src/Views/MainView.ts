import { $, h, StoreLib, UIStoreLib } from '../External';
import { Model } from '../Model';
import * as GraphView from '../Views/GraphView';
import * as ModalsView from '../Views/ModalsView';
import * as TestingView from './TestingView';

export interface State {
  testing: TestingView.State
}
const defaultState: State = { 
  testing: TestingView.defaultState 
};

const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  return {
    testing: TestingView.reducer(state.testing, action)
  }
}

const store = StoreLib.createStore<State>(reducer);

//////////////////////

export class MainView {
  static render(model: Model) {
    MainView.focusElemIdToFocus(model);
    
    return h(UIStoreLib.Provider, { store: store }, 
      h('div', {}, [
        GraphView.render(model),
        ModalsView.render(model),
        h(TestingView.Component)
        ])
      );
  }

  static focusElemIdToFocus(model: Model) {
    setTimeout(() => {
      if (model.elemIdToFocus && model.elemIdToFocus != '') {
        const elem = $('#'+model.elemIdToFocus)
        if (elem) { elem.focus(); }
      }
    }, 0);
  }
}