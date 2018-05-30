import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { SaveFileDialog, dialogIsOfKind, DialogKind, FileDialogStatus } from '../../Dialogs/Dialog';
import { objectJoinExtend, Log } from '../../Common';
import { MainProps } from '../MainView';
import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import * as Key from '../../Key';
import { GraphNode } from '../../Graphs/GraphNode';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { DirectoryEntryKind, FilesystemPredicates } from '../../Entities/Filesystem';
import { extname, join } from 'path';
import { Graph } from '../../Graphs/Graph';

export function SaveFileDialogView(props: DialogProps<SaveFileDialog>) {
  return h('div', {}, [ getSummaryText(props),
    ' ', // TODO add a text field with its submit button for new files
    hc(DialogCancelButtonView, props)
  ]);
}

function getSummaryText(props: DialogProps<SaveFileDialog>) {
  const statusText = (props.dialog.fileDialogStatus == FileDialogStatus.LoadingDirectory) 
    ? `loading directory: ${props.dialog.directoryPath}`
    : (props.dialog.fileDialogStatus == FileDialogStatus.ProcessingSubmit)
    ? `saving file: ${props.dialog.filePath}`
    : `current directory: ${props.dialog.directoryPath}`;
  return `Saving a file (${statusText})`;
}

export function saveFileDialogKeyHandler(props: MainProps, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type == KeyEventType.keyUp) {
      const currentNode = props.current.saGraphView.currentNode;
      const dialogIndex = props.current.dialogIndex;
      const dialog = props.current.dialog;
      const graph = props.current.graph
      if (dialog && !dialogIsOfKind(DialogKind.SaveFile)(dialog)) {
        Log.error("Calling SaveFileDialogKeyHandler from incorrect dialog: "+JSON.stringify(dialog));
      } else if (currentNode && dialogIndex != undefined && dialog && graph) {
        const fileName = currentNode.getValue();
        if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.Directory).length > 0) {
          props.changeFileDialogDirectory(dialogIndex, dialog.directoryPath+'/'+currentNode.getValue());
        } else if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.File).length > 0) {
          tryToSaveFile(fileName, dialog.directoryPath, props, dialogIndex, graph);
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

function tryToSaveFile(fileName: string, directoryPath: string, props: MainProps, dialogIndex: number, graph: Graph){
  Log.debug(`${SaveFileDialogView.name} trying to save file: ${fileName}`);
  const filePath = join(directoryPath, fileName);
  if (!canSaveFile(fileName)) {
    alert(`Cannot save file (unsupported extension): ${fileName}`); // TODO don't use 'alert()' for UI messages
    return;
  }
  if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.File).length > 0
    && !confirm(`File "${fileName}" exists. Overwrite?`)) {
      return; // TODO have a state of current file of a view and don't ask for overwriting if it didn't change
  }
  props.saveFileDialogSaveFile(dialogIndex, filePath);
}

function canSaveFile(fileName: string): boolean {
  switch (extname(fileName)) {
    case '.jsonld':
      return true;
    default:
      return false;
  }
}