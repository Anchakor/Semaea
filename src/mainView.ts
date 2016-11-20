import { h, $ } from "./external";
import * as GraphView from "./graphView";
import * as ModalsView from "./modalsView";
import { Model } from "./model";

export function render(model: Model) {
  model.refresh = h.refresh;
  focusElemIdToFocus(model);
  
  return h('div',
    GraphView.render(model),
    ModalsView.render(model)
    );
}

function focusElemIdToFocus(model: Model) {
  setTimeout(() => {
    if (model.elemIdToFocus != null && model.elemIdToFocus != '') {
      const elem = $('#'+model.elemIdToFocus)
      if (elem != null) { elem.focus(); }
    }
  }, 0);
}