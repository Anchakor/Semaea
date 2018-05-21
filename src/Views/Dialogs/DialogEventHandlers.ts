import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import { MainProps } from '../MainView';
import { shouldDialogBeVisible, DialogKind } from '../../Dialogs/Dialog';
import { dialogMenuDialogKeyHandler, dialogMenuDialogEntityMouseClickHandler } from './DialogMenuDialogView';
import { openFileDialogKeyHandler } from './OpenFileDialogView';
import { GraphNode } from 'Graphs/GraphNode';

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
    default:
      return false;
  }
}

/**
 * @param graphNode The GraphNode which was clicked
 */
export function dialogEntityMouseClickHandler(props: MainProps, event: MouseEvent, graphNode: GraphNode): boolean {
  if (!props.current.dialog) return false;
  if (!shouldDialogBeVisible(props.current.dialog)) return false;

  switch (props.current.dialog.kind) {
    case DialogKind.DialogMenu:
      return dialogMenuDialogEntityMouseClickHandler(props, event, graphNode);
    default:
      return false;
  }
}
