import { h, hc, Dispatch } from '../../External';
import { DialogProps } from '../DialogView';
import { SaveFileDialog, dialogIsOfKind, DialogKind, FileDialogStatus } from '../../Dialogs/Dialog';
import { Log } from '../../Common';
import { KeyEventOptions, KeyEventType } from '../InputEventHandlers';
import * as Key from '../../Key';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { DirectoryEntryKind, FilesystemPredicates } from '../../Entities/Filesystem';
import { extname, join } from 'path';
import { Graph } from '../../Graphs/Graph';
import { StoreState } from '../../UIStore/Main';
import { getCurrentProps } from '../CurrentProps';
import { changeFileDialogDirectory } from '../../UIStore/Dialogs/FileDialogCommon';
import { createSetChangeFocusToGraphFilterAction } from '../../UIStore/Focus';
import { saveFileDialogSaveFile } from '../../UIStore/Dialogs/SaveFileDialog';
import { createDeleteGraphAction } from '../../UIStore/Graphs';

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

export function saveFileDialogKeyHandler(dispatch: Dispatch<StoreState>, getState: () => StoreState, event: KeyboardEvent, options: KeyEventOptions, type: KeyEventType): boolean {
  const current = getCurrentProps(getState());
  if ( Key.isSpacebar(event) && !(options & KeyEventOptions.KeepSpacebar)) {
    if (type == KeyEventType.keyUp) {
      const currentGraphIndex = current.saGraphView.graphIndex;
      const currentNode = current.saGraphView.currentNode;
      const dialogIndex = current.dialogIndex;
      const dialog = current.dialog;
      const graph = current.graph;
      if (dialog && !dialogIsOfKind(DialogKind.SaveFile)(dialog)) {
        Log.error("Calling SaveFileDialogKeyHandler from incorrect dialog: "+JSON.stringify(dialog));
      } else if (currentNode && dialogIndex != undefined && dialog && graph) {
        const fileName = currentNode.getValue();
        if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.Directory).length > 0) {
          changeFileDialogDirectory(dialogIndex, dialog.directoryPath+'/'+currentNode.getValue())(dispatch);
          dispatch(createSetChangeFocusToGraphFilterAction());
        } else if (graph.get(fileName, FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.File).length > 0) {
          tryToSaveFile(dispatch, getState, fileName, dialog.directoryPath, dialogIndex, dialog, graph, currentGraphIndex);
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

function tryToSaveFile(dispatch: Dispatch<StoreState>, getState: () => StoreState, fileName: string, directoryPath: string, dialogIndex: number, dialog: SaveFileDialog, graph: Graph, currentGraphIndex: number) {
  const current = getCurrentProps(getState());
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
  const origSaViewIndex = current.saView.originatingSaViewIndex;
  if (origSaViewIndex == undefined) return;
  const state = getState();
  const origSaView = state.saViews_.saViews[origSaViewIndex];
  const origGraphView = state.graphs_.saGraphViews[origSaView.saGraphViewIndex];
  const origGraph = state.graphs_.graphs[origGraphView.graphIndex];
  if (!origGraph) return;
  saveFileDialogSaveFile(dialogIndex, filePath, origGraph)(dispatch);
  dispatch(createDeleteGraphAction(currentGraphIndex));
}

function canSaveFile(fileName: string): boolean {
  switch (extname(fileName)) {
    case '.jsonld':
      return true;
    default:
      return false;
  }
}