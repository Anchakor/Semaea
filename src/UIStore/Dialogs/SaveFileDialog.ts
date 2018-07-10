import { StoreLib, Reducer, ArrayBufferTools } from '../../External';
import { normalize } from 'path';
import { WriteFileRequest } from '../../Server/Request';
import { request } from '../../Server/Client';
import { ResponseKind, responseIsOfKind, handleUnexpectedResponse } from '../../Server/Response';
import { CreateFileDialogAction, doCreateFileDialogAction, createFileDialog, doFileDialogAction } from '../Dialogs/FileDialogCommon';
import { StoreState } from '../Main';
import { DialogKind, SaveFileDialog, FileDialogStatus, dialogIsOfKind } from '../../Dialogs/Dialog';
import { objectJoin } from '../../Common';
import { Graph } from '../../Graphs/Graph';
import * as cbor from 'cbor-js';
import { createFinishDialogAction } from '../Dialogs';
import * as Serializer from '../../Serialization/Serializer';


export const saveFileDialogSaveFile = (dialogIndex: number, filePath: string, graph: Graph) => (dispatch: (a: StoreLib.Action) => void) => {
  filePath = normalize(filePath);
  dispatch(createSaveFileDialogSavingFileAction({ dialogIndex: dialogIndex, filePath: filePath }));
  const payload = Serializer.serialize(graph);
  const req = new WriteFileRequest();
  req.filePath = filePath;
  req.content = ArrayBufferTools.fromStringToUint8(payload);
  const p1 = request(req, ResponseKind.WriteFileResponse)
  .then((response) => {
    if (responseIsOfKind(ResponseKind.WriteFileResponse)(response)) {
      alert(`Saved file ${filePath}`); // TODO non-alert message
      dispatch(createFinishDialogAction(dialogIndex));
    } else handleUnexpectedResponse(response);
  }).catch(handleUnexpectedResponse);
}

// CreateSaveFileDialogAction
export enum ActionType { CreateSaveFileDialog = 'CreateSaveFileDialog' }
interface CreateSaveFileDialogAction extends CreateFileDialogAction<ActionType.CreateSaveFileDialog> {
}
function doCreateSaveFileDialogAction(state: StoreState, action: CreateSaveFileDialogAction) {
  return doCreateFileDialogAction(DialogKind.SaveFile, state, action);
}
export const createSaveFileDialog = createFileDialog(ActionType.CreateSaveFileDialog);

// SaveFileDialogSavingFileAction
export enum ActionType { SaveFileDialogSavingFile = 'SaveFileDialogSavingFile' }
interface SaveFileDialogSavingFileAction extends StoreLib.Action { type: ActionType.SaveFileDialogSavingFile
  dialogIndex: number
  filePath: string
}
const createSaveFileDialogSavingFileAction = (partialAction: Partial<SaveFileDialogSavingFileAction>) => objectJoin<SaveFileDialogSavingFileAction>({ type: ActionType.SaveFileDialogSavingFile,
  dialogIndex: 0,
  filePath: ''
}, partialAction);
function doSaveFileDialogSavingFileAction(state: StoreState, action: SaveFileDialogSavingFileAction) {
  function getNewDialog(action: SaveFileDialogSavingFileAction, dialog: SaveFileDialog): SaveFileDialog | undefined {
    return objectJoin(dialog, { fileDialogStatus: FileDialogStatus.ProcessingSubmit, filePath: action.filePath });
  }
  function getNewGraph(action: SaveFileDialogSavingFileAction, graph: Graph): Graph | undefined {
    return new Graph();
  }
  return doFileDialogAction(state, action, dialogIsOfKind(DialogKind.SaveFile), getNewDialog, getNewGraph, undefined);
}

// Reducer:

export const reducer: Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.CreateSaveFileDialog:
      return doCreateSaveFileDialogAction(state, action as CreateSaveFileDialogAction);
    case ActionType.SaveFileDialogSavingFile:
      return doSaveFileDialogSavingFileAction(state, action as SaveFileDialogSavingFileAction);
    default:
      return state;
  }
}

