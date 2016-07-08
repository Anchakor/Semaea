namespace Modals {

  export namespace Autocomplete {
    class Form implements IComponent {
      render: (form: Form) => Plastiq.VNode
      submit: () => void
      close: () => void
      entryComparer: (text: string, entryText: string) => boolean = containsEntryComparer

      label = ''
      textElementId = ''
      currentText = 'default'
      writtenText = 'default'
      setWrittenText = (value: string) => {
        this.writtenText = value;
        this.currentText = value;
        this.entries = Utils.filterArray(this.initialEntries, this.entryComparer, this.writtenText);
        this.setSelection(-1);
      }
      selectedIdx = -1
      initialEntries: Array<IString> = []
      entries: Array<IString> = []
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
          this.currentText = this.entries[newIdx].toString();
        }
        this.selectedIdx = newIdx;
      }
    }

    export class Result<T> {
      constructor(text: string, value: T) {
        this.text = text;
        this.value = value;
      }

      text: string
      value: T
    }

    function containsEntryComparer(entry: IString, text: string) {
      return entry.toString().indexOf(text) >= 0;
    }

    const formFunctionCurry = <T>(label: string, entries: Array<T>, returnFocusOnResolve: boolean = true): IFormFunction<Result<T>> => 
    (closeForm: ICloseFormFunction<Result<T>>, elementIdToBeFocused: string): IComponent => {
      const form = new Form();
      form.textElementId = elementIdToBeFocused;
      form.label = label
      form.entries = entries;
      form.initialEntries = entries;
      form.entryComparer = containsEntryComparer;
      form.close = function() {
        closeForm(this, false, new Result<T>('', null), returnFocusOnResolve);
      };
      form.submit = function() {
        closeForm(this, true, new Result<T>($('#'+form.textElementId).value, <T>form.entries[form.selectedIdx]), returnFocusOnResolve);
      };
      form.render = (thisForm: Form) => { 
        const inputBox = h('input', {
            type: 'text', 
            id: thisForm.textElementId,
            binding: { 
              get: (): string => { return thisForm.currentText; },
              set: (value: string) => { thisForm.setWrittenText(value); }
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
            thisForm.entries[entryId].toString()
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
    
    export function showAutocompleteForm<T extends IString>(model: Model, entries: Array<T>, label: string = '', returnFocusOnResolve: boolean = true) {
      return makeForm(model, formFunctionCurry(label, entries, returnFocusOnResolve));
    }
  }
}