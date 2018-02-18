import { $, h, UIStoreLib, hc, hc2 } from '../External';
import { Model } from '../Model';
import { store } from '../UIStore/Main';
import * as SaViewView from '../Views/SaViewView';
import * as DialogView from '../Views/DialogView';
import * as GraphView from '../Views/GraphView';
import * as ModalsView from '../Views/ModalsView';
import * as TestingView from '../Views/TestingView';

export class MainView {
  static render(model: Model) {
    MainView.focusElemIdToFocus(model);
    
    return hc2(UIStoreLib.Provider, { store: store, children: undefined }, 
      h('div', {}, [
        hc(ModalsView.Component),
        hc(SaViewView.Component),
        hc(DialogView.Component),
        hc(GraphView.Component),
        hc(TestingView.Component)
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