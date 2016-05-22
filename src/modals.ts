namespace Modals {
  
  interface ICloseFormFunction<T> {
    (form: any, isResolved: boolean, resolveRejectValue: T): void
  }
  interface IFormFunction<T> {
    (closeForm: ICloseFormFunction<T>, elementIdToBeFocused: string): any
  }
  
  function makeForm<T>(model: Model, formFunction: IFormFunction<T>) {
    const pastFocus = document.activeElement;
    const p = new Promise<T>((resolve, reject) => {
      const modalPosition = model.modals.length;
      const closeForm: ICloseFormFunction<T> = (formToClose: any, isResolved: boolean, resolveRejectValue: T) => {
        ModalsView.closeModal(model, formToClose);
        (<HTMLElement>pastFocus).focus();
        if (isResolved) {
          resolve(resolveRejectValue);
        } else {
          reject(resolveRejectValue);
        }
      }
      const form1 = formFunction(closeForm, 'modal'+modalPosition);
      model.modals.push(form1);
      model.elemIdToFocus = 'modal'+modalPosition;
    }); 
    //plastiq.html.refreshAfter(p);
    return p;
  }
  
  export function formGetString(model: Model) {
    const formFunction: IFormFunction<string> = function (closeForm: ICloseFormFunction<string>, elementIdToBeFocused: string) {
      const form = h('div', 
        h('input', {
          type: 'text', id: elementIdToBeFocused,
          onkeydown: function (e: KeyboardEvent) {
            if (e.keyCode == 13 /*enter*/) {
              closeForm(form, true, (<HTMLInputElement>e.target).value);
              return false;
            }
            return true;
          }
        })
      );
      return form;
    }
    return makeForm(model, formFunction);
  }
}