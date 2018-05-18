import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import { MainProps } from '../MainView';
import { shouldDialogBeVisible, DialogType } from '../../Dialogs/Dialog';
import { dialogMenuDialogKeyHandler } from './DialogMenuDialogView';
import { openFileDialogKeyHandler } from './OpenFileDialogView';

/*
Custom event handling callbacks for UI (HTML) elements, when a particular dialog is opened in the view.
*/

export function dialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if (!props.current.dialog) return false;
  if (!shouldDialogBeVisible(props.current.dialog)) return false;

  switch (props.current.dialog.type) {
    case DialogType.DialogMenu:
      return dialogMenuDialogKeyHandler(props, event, options, type);
    case DialogType.OpenFile:
      return openFileDialogKeyHandler(props, event, options, type);
    default:
      return false;
  }
}
