namespace Modals {
  
  interface ICloseFormFunction<T> {
    (form: any, isResolved: boolean, resolveRejectValue: T): void
  }
  interface IFormFunction<T> {
    (closeForm: ICloseFormFunction<T>, elementIdToBeFocused: string): IComponent
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
    const formFunction = function (closeForm: ICloseFormFunction<string>, elementIdToBeFocused: string) {
      const form = { 
        render: (formArg) => { return h('div', 
          h('input', {
            type: 'text', id: elementIdToBeFocused,
            onkeydown: function (e: KeyboardEvent) {
              if (Key.isEnter(e)) {
                closeForm(formArg, true, (<HTMLInputElement>e.target).value);
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
  
  export namespace Autocomplete {
    class Form implements IComponent {
      render: (form: Form) => Plastiq.VNode
      currentText = 'default'
      writtenText = 'default'
      selectedIdx = -1
      entries: Array<any> = []
    }
    
    function selectionChange(form: Form, change: number) {
      const naiveNewIdx = form.selectedIdx + change;
      const totalLength = form.entries.length + 1;
      const newIdx = ((totalLength + (naiveNewIdx + 1)) % totalLength) - 1;
      if (newIdx == -1) {
        form.currentText = form.writtenText;
      } else {
        form.currentText = form.entries[newIdx];
      }
      form.selectedIdx = newIdx;
    }
    
    export function getGetStringAutocomplete(model: Model, entries: Array<any>) {
      const formFunction = function (entries: Array<any>, closeForm: ICloseFormFunction<string>, elementIdToBeFocused: string) {
        const form = new Form();
        form.entries = entries;
        form.render = (thisForm) => { return h('div', 
            h('input', {
              type: 'text', 
              id: elementIdToBeFocused,
              binding: { 
                get: () => { return thisForm.currentText; },
                set: (value) => { 
                    thisForm.writtenText = value;
                    thisForm.currentText = value;
                  }
              },
              value: thisForm.currentText,
              onkeydown: function (e: KeyboardEvent) {
                if (Key.isEnter(e)) {
                  closeForm(thisForm, true, (<HTMLInputElement>e.target).value);
                  return false;
                }
                else if (Key.isDownArrow(e)) {
                  selectionChange(thisForm, 1);
                  //model.refresh();
                }
                else if (Key.isUpArrow(e)) {
                  selectionChange(thisForm, -1);
                  //model.refresh();
                }
                return true;
              }
            }),
            thisForm.currentText, // TODO remove
            thisForm.entries.map((val, ix, arr) => {
              return menuEntryView(thisForm, ix, (ix == thisForm.selectedIdx));
            })
          )};
        return form;
      }
      return makeForm(model, Utils.partial(formFunction, entries));
    }
    
    function menuEntryView(form: Form, entryId: number, selected: boolean = false) {
      return h('div',
        {
          class: 'menuEntry' + ((selected) ? '-selected' : '')
        },
        form.entries[entryId]
      );
    }
  }
}