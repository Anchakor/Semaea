import { h, hc, Dispatch } from '../../External';
import { DialogProps } from '../DialogView';
import { OpenFileDialog, dialogIsOfKind, DialogKind, FileDialogStatus } from '../../Dialogs/Dialog';
import { Log } from '../../Common';
import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import * as Key from '../../Key';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { DirectoryEntryKind, FilesystemPredicates } from '../../Entities/Filesystem';
import { extname, join } from 'path';
import { getCurrentProps } from '../CurrentProps';
import { StoreState } from '../../UIStore/Main';
import { changeFileDialogDirectory } from '../../UIStore/Dialogs/FileDialogCommon';
import { createSetChangeFocusToGraphFilterAction } from '../../UIStore/Focus';
import { openFileDialogOpenFile } from '../../UIStore/Dialogs/OpenFileDialog';
import { createDeleteGraphAction } from '../../UIStore/Graphs';

export function OpenFileDialogView(props: DialogProps<OpenFileDialog>) {
  return h('div', {}, [ getSummaryText(props),
    ' ', 
    hc(DialogCancelButtonView, props)
  ]);
}

function getSummaryText(props: DialogProps<OpenFileDialog>) {
  const statusText = (props.dialog.fileDialogStatus == FileDialogStatus.LoadingDirectory) 
    ? `loading directory: ${props.dialog.directoryPath}`
    : (props.dialog.fileDialogStatus == FileDialogStatus.ProcessingSubmit)
    ? `loading file: ${props.dialog.filePath}`
    : `current directory: ${props.dialog.directoryPath}`;
  return `Opening a file (${statusText})`;
}

export function openFileDialogKeyHandler(dispatch: Dispatch<StoreState>, getState: () => StoreState, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  const current = getCurrentProps(getState());
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type == KeyEventType.keyUp) {
      const currentGraphIndex = current.saGraphView.graphIndex;
      const currentNode = current.saGraphView.currentNode;
      const dialogIndex = current.dialogIndex;
      const dialog = current.dialog;
      const graph = current.graph
      if (dialog && !dialogIsOfKind(DialogKind.OpenFile)(dialog)) {
        Log.error("Calling openFileDialogKeyHandler from incorrect dialog: "+JSON.stringify(dialog));
      } else if (currentNode && dialogIndex != undefined && dialog && graph) {
        const fileName = currentNode.getValue();
        if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.Directory).length > 0) {
          changeFileDialogDirectory(dialogIndex, dialog.directoryPath+'/'+currentNode.getValue())(dispatch);
          dispatch(createSetChangeFocusToGraphFilterAction());
        } else if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.File).length > 0) {
          tryToOpenFile(dispatch, getState, fileName, dialog.directoryPath, dialogIndex, currentGraphIndex);
        }
      }
      event.preventDefault();
    } else {
      event.preventDefault();
    }
    return true;
  }
  return false;
}

function tryToOpenFile(dispatch: Dispatch<StoreState>, getState: () => StoreState, fileName: string, directoryPath: string, dialogIndex: number, currentGraphIndex: number) {
  Log.debug(`${OpenFileDialogView.name} trying to open file: ${fileName}`);
  const current = getCurrentProps(getState());
  const filePath = join(directoryPath, fileName);
  if (!canOpenFile(fileName)) {
    alert(`Cannot open file (unsupported extension): ${fileName}`); // TODO don't use 'alert()' for UI messages
    return;
  }
  const origSaViewIndex = current.saView.originatingSaViewIndex;
  if (origSaViewIndex == undefined) return;
  openFileDialogOpenFile(dialogIndex, filePath, origSaViewIndex)(dispatch);
  dispatch(createDeleteGraphAction(currentGraphIndex));
}

function canOpenFile(fileName: string): boolean {
  switch (extname(fileName)) {
    case '.jsonld':
      return true;
    default:
      return false;
  }
}