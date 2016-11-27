import { h, $ } from "External";
import * as GraphView from "GraphView";
import * as ModalsView from "ModalsView";
import { Model } from "Model";

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