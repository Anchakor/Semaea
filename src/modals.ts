class Modals {
  static render(model: Model) {
    return h('div', {
        class: "modals"
      }, model.modals.map(function (modal, i, a) {
        return h('div', {
          class: "modal" + ((i + 1 == a.length) ? " modal-top" : "")
        }, modal);
      }),
      h('div', {
        class: (model.modals.length > 0) ? "modalBackground" : ""
      }));
  }
  
  static closeModal(model: Model, modal) {
    model.modals = (model.modals).filter(function (val, ix) {
        return val != modal;
      });
    model.refresh();
  }
  
  static formGetString(model: Model) {
    var pastFocus = document.activeElement;
    var p = new Promise<string>(function (resolve, reject) {
      var position = model.modals.length;
      var form = h('div', 
        h('input', {
          type: 'text', id: 'modal'+position,
          onkeydown: function (e: KeyboardEvent) {
            if (e.keyCode == 13 /*enter*/) {
              Modals.closeModal(model, form);
              (<HTMLElement>pastFocus).focus();
              resolve((<HTMLInputElement>e.target).value)
              return false;
            }
            return true;
          }
        })
      );
      model.modals.push(form);
      model.elemIdToFocus = 'modal'+position;
    }); 
    //plastiq.html.refreshAfter(p);
    return p;
  }
}