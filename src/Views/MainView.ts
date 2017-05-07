import { test } from '../Test';
import { isStatefulComponent } from 'inferno-shared/dist';
import { TestingView, TestingComponent, TestIncrementStoreActionTypeConst, TestIncrementStoreAction } from './TestingView';
import { $, Component, h, StoreLib, UIStoreLib } from '../External';
import * as GraphView from '../Views/GraphView';
import * as ModalsView from '../Views/ModalsView';
import { Model } from '../Model';


export class State {
  testing: { x: number }
}

const reducer: StoreLib.Reducer<State> = (state: State = { testing: { x: 10 } }, action: TestIncrementStoreAction) => {
  switch (action.type) {
    case TestIncrementStoreActionTypeConst:
      return Object.assign({}, state, { testing: { x: state.testing.x + action.value } });
    default:
      return state;
  }
}

const store = StoreLib.createStore<State>(reducer);

export class MainView {
  static render(model: Model) {
    MainView.focusElemIdToFocus(model);
    
    return h(UIStoreLib.Provider, { store: store }, 
      h('div', {}, [
        GraphView.render(model),
        ModalsView.render(model),
        h(TestingComponent)
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