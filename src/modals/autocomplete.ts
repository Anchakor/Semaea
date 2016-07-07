namespace Modals {

  export namespace Autocomplete {
    class Form implements IComponent {
      render: (form: Form) => Plastiq.VNode
      submit: () => void
      close: () => void

      label = ''
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
    
    export function getGetStringAutocomplete(model: Model, entries: Array<any>, label: string = '') {
      const formFunction = function (label: string, entries: Array<any>, closeForm: ICloseFormFunction<string>, elementIdToBeFocused: string) {
        const form = new Form();
        form.textElementId = elementIdToBeFocused;
        form.label = label
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
          const label = h('p', { style: 'margin: 0; margin-bottom: 0.3em;'}, thisForm.label);
          return h('div', label, inputBox, submitButton, cancelButton, menuEntries)
        };
        return form;
      }
      return makeForm(model, Utils.partial(formFunction, label, entries));
    }
  }
}