import { h } from "External"
import { Model } from "Model";
import { IComponent } from "Common";

export function render(model: Model) {
  const x = model.modals.map((modal, i, a) => {
    return h('div', {
      class: "modal" + ((i + 1 == a.length) ? " modal-top" : "")
    }, modal.render());
  });
  x.push(h('div', {
    class: (model.modals.length > 0) ? "modalBackground" : ""
  }));
  return h('div', {
      class: "modals"
    }, x);
}

export function closeModal(model: Model, modal: IComponent) {
  model.modals = (model.modals).filter((val, ix) => {
      return val != modal;
    });
}
