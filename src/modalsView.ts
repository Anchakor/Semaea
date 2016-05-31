namespace ModalsView {
  export function render(model: Model) {
    return h('div', {
        class: "modals"
      }, model.modals.map((modal, i, a) => {
        return h('div', {
          class: "modal" + ((i + 1 == a.length) ? " modal-top" : "")
        }, modal.render(modal));
      }),
      h('div', {
        class: (model.modals.length > 0) ? "modalBackground" : ""
      }));
  }
  
  export function closeModal(model: Model, modal) {
    model.modals = (model.modals).filter((val, ix) => {
        return val != modal;
      });
    model.refresh();
  }
}