import { KeyEventOptions } from './InputEventHandlers';
import { MainProps } from './MainView';
import { shouldDialogBeVisible, DialogType } from '../Dialogs/Dialog';
import { dialogMenuDialogKeyHandler } from './Dialogs/DialogMenuDialogView';

/*
Custom event handling callbacks for UI (HTML) elements, when a particular dialog is opened in the view.
*/

export enum KeyEventType {
  keyDown = 'keyDown',
  keyUp = 'keyUp',
}

export function dialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if (!props.current.dialog) return false;
  if (!shouldDialogBeVisible(props.current.dialog)) return false;

  switch (props.current.dialog.type) {
    case DialogType.DialogMenu:
      return dialogMenuDialogKeyHandler(props, event, options, type);
    default:
      return false;
  }
}
