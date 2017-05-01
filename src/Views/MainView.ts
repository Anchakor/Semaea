import { h, $ } from '../External';
import * as GraphView from '../Views/GraphView';
import * as ModalsView from '../Views/ModalsView';
import { Model } from '../Model';

export class MainView {
  static render(model: Model) {
    MainView.focusElemIdToFocus(model);
    
    return h('div', {}, [
      GraphView.render(model),
      ModalsView.render(model)
      ]);
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