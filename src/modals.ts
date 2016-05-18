namespace Modals {  
  export function formGetString(model: Model) {
    const pastFocus = document.activeElement;
    const p = new Promise<string>((resolve, reject) => {
      const position = model.modals.length;
      const form = h('div', 
        h('input', {
          type: 'text', id: 'modal'+position,
          onkeydown: function (e: KeyboardEvent) {
            if (e.keyCode == 13 /*enter*/) {
              ModalsView.closeModal(model, form);
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