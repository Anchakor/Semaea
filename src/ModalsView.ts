import { h } from "External"
import { Model } from "Model";
import { IComponent } from "Common";

export function render(model: Model) {
  return h('div', {
      class: "modals"
    }, model.modals.map((modal, i, a) => {
      return h('div', {
        class: "modal" + ((i + 1 == a.length) ? " modal-top" : "")
      }, modal.render());
    }),
    h('div', {
      class: (model.modals.length > 0) ? "modalBackground" : ""
    }));
}

export function closeModal(model: Model, modal: IComponent) {
  model.modals = (model.modals).filter((val, ix) => {
      return val != modal;
    });
  model.refresh();
}