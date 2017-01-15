import { h, $ } from "External";
import * as Modals from "Modals/Modals";
import { IString, IComponent } from "Common";
import { Model } from "Model";
import * as Plastiq from "plastiq";
import * as Utils from "Utils";
import * as Key from "Key";

class Form implements IComponent {
  render: () => Plastiq.VNode
  submit: () => void
  close: () => void
  entryComparer: (text: IString, entryText: IString) => boolean = containsEntryComparer

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

function containsEntryComparer(entry: IString, text: IString) {
  return entry.toString().indexOf(text.toString()) >= 0;
}

const formFunctionCurry: <T>(label: string, entries: Array<T>, returnFocusOnResolve: boolean) 
  => Modals.IFormFunction<Result<T>> 
  = <T>(label: string, entries: Array<T>, returnFocusOnResolve: boolean = true) => 
    (closeForm: Modals.ICloseFormFunction<Result<T>>, elementIdToBeFocused: string): IComponent => {
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
  form.render = () => { 
    const inputBox = h('input', {
        type: 'text', 
        id: form.textElementId,
        binding: { 
          get: (): string => { return form.currentText; },
          set: (value: string) => { form.setWrittenText(value); }
        },
        value: form.currentText,
        onkeydown: function (e: KeyboardEvent) {
          if (Key.isEscape(e)) {
            form.close();
            return false;
          }
          else if (Key.isEnter(e)) {
            form.submit();
            return false;
          }
          else if (Key.isDownArrow(e)) {
            form.selectionChange(1);
          }
          else if (Key.isUpArrow(e)) {
            form.selectionChange(-1);
          }
          return true;
        }
      });
    const submitButton = h('button', {
        onclick: function (e: MouseEvent) {
          form.submit();
        }
      }, "O");
    const cancelButton = h('button', {
        onclick: function (e: MouseEvent) {
          form.close();
        }
      }, "X");
    const menuEntryView = (entryId: number, selected: boolean) => {
      return h('div',
        {
          class: 'menuEntry' + ((selected) ? '-selected' : ''),
          onclick: function (e: MouseEvent) {
            if (!selected) {
              form.setSelection(entryId);
            } else {
              form.submit();
            }
          }
        },
        form.entries[entryId].toString()
      );
    };
    const menuEntries = form.entries.map((val, ix, arr) => {
        return menuEntryView(ix, (ix == form.selectedIdx));
      });
    const label = h('p', { style: 'margin: 0; margin-bottom: 0.3em;'}, form.label);
    return h('div', label, inputBox, submitButton, cancelButton, menuEntries)
  };
  return form;
}

export function showAutocompleteForm<T extends IString>(model: Model, entries: Array<T>, label: string = '', returnFocusOnResolve: boolean = true) {
  return Modals.makeForm(model, formFunctionCurry(label, entries, returnFocusOnResolve));
}