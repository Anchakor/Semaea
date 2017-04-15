import { h } from "External";
import * as ModalsView from "Views/ModalsView";
import { IComponent } from "Common";
import { Model } from "Model";
import * as Key from "Key";
  
export interface ICloseFormFunction<T> {
  (form: IComponent, isResolved: boolean, resolveRejectValue: T, returnFocusOnResolve: boolean): void
}
export interface IFormFunction<T> {
  (closeForm: ICloseFormFunction<T>, elementIdToBeFocused: string): IComponent
}

export function makeForm<T>(model: Model, formFunction: IFormFunction<T>) {
  const pastFocus = document.activeElement;
  const p = new Promise<T>((resolve, reject) => {
    const modalPosition = model.modals.length;
    const closeForm: ICloseFormFunction<T> = (formToClose: IComponent, isResolved: boolean, resolveRejectValue: T, returnFocusOnResolve: boolean = true) => {
      ModalsView.closeModal(model, formToClose);
      if (isResolved) {
        if (returnFocusOnResolve) {
          (<HTMLElement>pastFocus).focus();
        }
        resolve(resolveRejectValue);
      } else {
        (<HTMLElement>pastFocus).focus();
        reject(resolveRejectValue);
      }
    }
    const form1 = formFunction(closeForm, 'modal'+modalPosition);
    model.modals.push(form1);
    model.elemIdToFocus = 'modal'+modalPosition;
  }); 
  //h.refreshAfter(p);
  return p;
}

export function formGetString(model: Model) {
  const formFunction: IFormFunction<string> = function (closeForm: ICloseFormFunction<string>, elementIdToBeFocused: string) {
    const form: IComponent = { 
      render: () => { return h('div', 
        h('input', {
          type: 'text', id: elementIdToBeFocused,
          onkeydown: function (e: KeyboardEvent) {
            if (Key.isEnter(e)) {
              closeForm(form, true, (<HTMLInputElement>e.target).value, true);
              return false;
            }
            return true;
          }
        })
      )}};
    return form;
  }
  return makeForm(model, formFunction);
}