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
      submit: () => void
      close: () => void

      textElementId = ''
      currentText = 'default'
      writtenText = 'default'
      setWrittenText = (value: string) => {
        this.writtenText = value;
        this.currentText = value;
      }
      selectedIdx = -1
      entries: Array<any> = []
      selectionChange = (change: number) => {
        const naiveNewIdx = this.selectedIdx + change;
        this.setSelection(naiveNewIdx);
      }
      setSelection = (index: number) => {
        const totalLength = this.entries.length + 1;
        const newIdx = ((totalLength + (index + 1)) % totalLength) - 1;
        if (newIdx == -1) {
          this.currentText = this.writtenText;
        } else {
          this.currentText = this.entries[newIdx];
        }
        this.selectedIdx = newIdx;
      }
    }
    
    export function getGetStringAutocomplete(model: Model, entries: Array<any>) {
      const formFunction = function (entries: Array<any>, closeForm: ICloseFormFunction<string>, elementIdToBeFocused: string) {
        const form = new Form();
        form.textElementId = elementIdToBeFocused;
        form.entries = entries;
        form.close = function() {
          closeForm(this, true, '');
        };
        form.submit = function() {
          closeForm(this, true, $('#'+form.textElementId).value);
        };
        form.render = (thisForm) => { 
          const inputBox = h('input', {
              type: 'text', 
              id: thisForm.textElementId,
              binding: { 
                get: () => { return thisForm.currentText; },
                set: (value) => { thisForm.setWrittenText(value); }
              },
              value: thisForm.currentText,
              onkeydown: function (e: KeyboardEvent) {
                if (Key.isEscape(e)) {
                  thisForm.close();
                  return false;
                }
                else if (Key.isEnter(e)) {
                  thisForm.submit();
                  return false;
                }
                else if (Key.isDownArrow(e)) {
                  thisForm.selectionChange(1);
                }
                else if (Key.isUpArrow(e)) {
                  thisForm.selectionChange(-1);
                }
                return true;
              }
            });
          const submitButton = h('button', {
              onclick: function (e: MouseEvent) {
                thisForm.submit();
              }
            }, "O");
          const cancelButton = h('button', {
              onclick: function (e: MouseEvent) {
                thisForm.close();
              }
            }, "X");
          const menuEntryView = (entryId: number, selected: boolean) => {
            return h('div',
              {
                class: 'menuEntry' + ((selected) ? '-selected' : ''),
                onclick: function (e: MouseEvent) {
                  if (!selected) {
                    thisForm.setSelection(entryId);
                  } else {
                    thisForm.submit();
                  }
                }
              },
              thisForm.entries[entryId]
            );
          };
          const menuEntries = thisForm.entries.map((val, ix, arr) => {
              return menuEntryView(ix, (ix == thisForm.selectedIdx));
            });
          return h('div', inputBox, submitButton, cancelButton, menuEntries)
        };
        return form;
      }
      return makeForm(model, Utils.partial(formFunction, entries));
    }
  }
}