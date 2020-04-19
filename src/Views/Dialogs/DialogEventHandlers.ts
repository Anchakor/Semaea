import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import { MainProps } from '../MainView';
import { shouldDialogBeVisible, DialogKind } from '../../Dialogs/Dialog';
import { dialogMenuDialogKeyHandler, dialogMenuDialogEntityMouseClickHandler } from './DialogMenuDialogView';
import { openFileDialogKeyHandler } from './OpenFileDialogView';
import { GraphNode } from '../../Graphs/GraphNode';
import { saveFileDialogKeyHandler } from './SaveFileDialogView';
import { CurrentProps, getCurrentProps } from '../CurrentProps';
import { Dispatch } from '../../External';
import { StoreState } from '../../UIStore/Main';

/*
Custom event handling callbacks for UI (HTML) elements, when a particular dialog is opened in the view.
*/

export function dialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if (!props.current.dialog) return false;
  if (!shouldDialogBeVisible(props.current.dialog)) return false;

  switch (props.current.dialog.kind) {
    case DialogKind.DialogMenu:
      return dialogMenuDialogKeyHandler(props, event, options, type);
    case DialogKind.OpenFile:
      return openFileDialogKeyHandler(props, event, options, type);
    case DialogKind.SaveFile:
      return saveFileDialogKeyHandler(props, event, options, type);
    default:
      return false;
  }
}

/**
 * @param graphNode The GraphNode which was clicked
 */
export function dialogEntityMouseClickHandler(dispatch: Dispatch<StoreState>, getState: () => StoreState, event: MouseEvent, graphNode: GraphNode): boolean {
  const current = getCurrentProps(getState());
  if (!current.dialog) return false;
  if (!shouldDialogBeVisible(current.dialog)) return false;

  if (event.button == 2) {
    switch (current.dialog.kind) {
      default:
        event.preventDefault();
        return true; // Preventing dialog menu triggering on dialog views
    }
  }

  switch (current.dialog.kind) {
    case DialogKind.DialogMenu:
      return dialogMenuDialogEntityMouseClickHandler(dispatch, getState, event, graphNode);
    default:
      return false;
  }
}
