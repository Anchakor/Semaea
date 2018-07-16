import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { OpenFileDialog, dialogIsOfKind, DialogKind, FileDialogStatus } from '../../Dialogs/Dialog';
import { objectJoinExtend, Log } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import * as Key from '../../Key';
import { GraphNode } from '../../Graphs/GraphNode';
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
  const statusText = (props.dialog.fileDialogStatus == FileDialogStatus.LoadingDirectory) 
    ? `loading directory: ${props.dialog.directoryPath}`
    : (props.dialog.fileDialogStatus == FileDialogStatus.ProcessingSubmit)
    ? `loading file: ${props.dialog.filePath}`
    : `current directory: ${props.dialog.directoryPath}`;
  return `Opening a file (${statusText})`;
}

export function openFileDialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type == KeyEventType.keyUp) {
      const currentGraphIndex = props.current.saGraphView.graphIndex;
      const currentNode = props.current.saGraphView.currentNode;
      const dialogIndex = props.current.dialogIndex;
      const dialog = props.current.dialog;
      const graph = props.current.graph
      if (dialog && !dialogIsOfKind(DialogKind.OpenFile)(dialog)) {
        Log.error("Calling openFileDialogKeyHandler from incorrect dialog: "+JSON.stringify(dialog));
      } else if (currentNode && dialogIndex != undefined && dialog && graph) {
        const fileName = currentNode.getValue();
        if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.Directory).length > 0) {
          props.changeFileDialogDirectory(dialogIndex, dialog.directoryPath+'/'+currentNode.getValue());
        } else if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.File).length > 0) {
          tryToOpenFile(fileName, dialog.directoryPath, props, dialogIndex, currentGraphIndex);
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

function tryToOpenFile(fileName: string, directoryPath: string, props: MainProps, dialogIndex: number, currentGraphIndex: number){
  Log.debug(`${OpenFileDialogView.name} trying to open file: ${fileName}`);
  const filePath = join(directoryPath, fileName);
  if (!canOpenFile(fileName)) {
    alert(`Cannot open file (unsupported extension): ${fileName}`); // TODO don't use 'alert()' for UI messages
    return;
  }
  const origSaViewIndex = props.current.saView.originatingSaViewIndex;
  if (origSaViewIndex == undefined) return;
  props.openFileDialogOpenFile(dialogIndex, filePath, origSaViewIndex);
  props.deleteGraph(currentGraphIndex);
}

function canOpenFile(fileName: string): boolean {
  switch (extname(fileName)) {
    case '.jsonld':
      return true;
    default:
      return false;
  }
}