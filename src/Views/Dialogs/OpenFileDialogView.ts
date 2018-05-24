import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { OpenFileDialog, dialogIsOfKind, DialogKind } from '../../Dialogs/Dialog';
import { objectJoinExtend, Log } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import * as Key from '../../Key';
import { GraphNode } from 'Graphs/GraphNode';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { DirectoryEntryKind, FilesystemPredicates } from '../../Entities/Filesystem';
import { extname, join } from 'path';

export function OpenFileDialogView(props: DialogProps<OpenFileDialog>) {
  return h('div', {}, [ getSummaryText(props),
    ' ', 
    hc(DialogCancelButtonView, props)
  ]);
}

function getSummaryText(props: DialogProps<OpenFileDialog>) {
  const statusText = (props.dialog.openFileStatus == 'loadingDirectory') 
    ? `loading directory: ${props.dialog.directoryPath}`
    : (props.dialog.openFileStatus == 'loadingFile')
    ? `loading file: ${props.dialog.filePath}`
    : `current directory: ${props.dialog.directoryPath}`;
  return `Opening a file (${statusText})`;
}

export function openFileDialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type == KeyEventType.keyUp) {
      const currentNode = props.current.saGraphView.currentNode;
      const dialogIndex = props.current.dialogIndex;
      const dialog = props.current.dialog;
      const graph = props.current.graph
      if (dialog && !dialogIsOfKind(DialogKind.OpenFile)(dialog)) {
        Log.error("Calling openFileDialogKeyHandler from incorrect dialog: "+JSON.stringify(dialog));
      } else if (currentNode && dialogIndex != undefined && dialog && graph) {
        // TODO use enum for directory/file
        if (graph.get(currentNode.getValue(), FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.Directory).length > 0) {
          props.changeOpenFileDialogDirectory(dialogIndex, dialog.directoryPath+'/'+currentNode.getValue());
        } else if (graph.get(currentNode.getValue(), FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.File).length > 0) {
          tryToOpenFile(currentNode.getValue(), dialog.directoryPath, props, dialogIndex);
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

function tryToOpenFile(fileName: string, directoryPath: string, props: MainProps, dialogIndex: number){
  Log.debug(`${OpenFileDialogView.name} trying to open file: ${fileName}`);
  const filePath = join(directoryPath, fileName);
  if (!canOpenFile(fileName)) {
    alert(`Cannot open file (unsupported extension): ${fileName}`); // TODO don't use 'alert()' for UI messages
    return;
  }
  props.openFileDialogOpenFile(dialogIndex, filePath);
}

function canOpenFile(fileName: string): boolean {
  switch (extname(fileName)) {
    case '.jsonld':
      return true;
    default:
      return false;
  }
}