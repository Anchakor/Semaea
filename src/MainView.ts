import { h, $ } from "External";
import * as GraphView from "GraphView";
import * as ModalsView from "ModalsView";
import { Model } from "Model";

export class MainView {
  static render(model: Model) {
    model.refresh = h.refresh;
    MainView.focusElemIdToFocus(model);
    
    return h('div',
      GraphView.render(model),
      ModalsView.render(model)
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