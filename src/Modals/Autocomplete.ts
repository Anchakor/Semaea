import { h, $, VNode } from '../External';
import * as Modals from '../Modals/Modals';
import { IString, IComponent } from '../Common';
import { Model } from '../Model';
import * as Utils from '../Utils';
import * as Key from '../Key';

class Form<T> implements IComponent {
  render: () => VNode
  submit: () => void
  close: () => void
  entryToString: (x: T) => string

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
  initialEntries: Array<T> = []
  entries: Array<T> = []
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
      this.currentText = this.entryToString(this.entries[newIdx]);
    }
    this.selectedIdx = newIdx;
  }
  entryComparer: (arrayValue: T, otherValue: string) => boolean = <U>(arrayValue: T, otherValue: string) => { 
    return this.entryToString(arrayValue).indexOf(otherValue) >= 0; 
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

const formFunctionCurry: <T>(label: string, entries: Array<T>, entryToString: (x: T) => string, returnFocusOnResolve: boolean) 
  => Modals.IFormFunction<Result<T | undefined>> 
  = <T>(label: string, entries: Array<T>, entryToString: (x: T) => string, returnFocusOnResolve: boolean = true) => 
    (closeForm: Modals.ICloseFormFunction<Result<T | undefined>>, elementIdToBeFocused: string): IComponent => {
  const form = new Form<T>();
  form.textElementId = elementIdToBeFocused;
  form.label = label
  form.entries = entries;
  form.initialEntries = entries;
  form.entryToString = entryToString;
  form.close = function(this: IComponent) {
    closeForm(this, false, new Result<T | undefined>('', undefined), returnFocusOnResolve);
  };
  form.submit = function(this: IComponent) {
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
      }, 'O');
    const cancelButton = h('button', {
        onclick: function (e: MouseEvent) {
          form.close();
        }
      }, 'X');
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
        entryToString(form.entries[entryId])
      );
    };
    const menuEntries = form.entries.map((val, ix, arr) => {
        return menuEntryView(ix, (ix == form.selectedIdx));
      });
    const label = h('p', { style: 'margin: 0; margin-bottom: 0.3em;'}, form.label);
    const entries = [label, inputBox, submitButton, cancelButton]
    entries.concat(menuEntries)
    return h('div', {}, entries);
  };
  return form;
}

export function showAutocompleteForm<T>(model: Model, entries: Array<T>, label: string = '', entryToString: (x: T) => string = (x: T) => x.toString(), returnFocusOnResolve: boolean = true) {
  return Modals.makeForm(model, formFunctionCurry(label, entries, entryToString, returnFocusOnResolve));
}