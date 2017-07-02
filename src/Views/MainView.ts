import { $, h, UIStoreLib } from '../External';
import { Model } from '../Model';
import { store } from '../UIStore/Main';
import * as GraphView from '../Views/GraphView';
import * as ModalsView from '../Views/ModalsView';
import * as TestingView from '../Views/TestingView';

export class MainView {
  static render(model: Model) {
    MainView.focusElemIdToFocus(model);
    
    return h(UIStoreLib.Provider, { store: store }, 
      h('div', {}, [
        h(ModalsView.Component),
        h(GraphView.Component),
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