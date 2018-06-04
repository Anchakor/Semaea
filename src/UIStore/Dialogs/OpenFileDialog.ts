import { StoreLib, Reducer, ArrayBufferTools } from '../../External';
import { normalize } from 'path';
import { ReadFileRequest } from '../../Server/Request';
import { request } from '../../Server/Client';
import { ResponseKind, responseIsOfKind, handleUnexpectedResponse } from '../../Server/Response';
import { CreateFileDialogAction, doCreateFileDialogAction, createFileDialog, doFileDialogAction } from '../Dialogs/FileDialogCommon';
import { StoreState } from '../Main';
import { DialogKind, OpenFileDialog, FileDialogStatus, dialogIsOfKind } from '../../Dialogs/Dialog';
import { objectJoin, Log } from '../../Common';
import { Graph } from '../../Graphs/Graph';
import { createFinishDialogAction } from '../Dialogs';
import * as cbor from 'cbor-js';
import { createOpenGraphAction } from '../Graphs';
import { createChangeSaViewSaGraphViewAction } from '../SaViews';


export const openFileDialogOpenFile = (dialogIndex: number, filePath: string, originatingSaViewIndex: number) => (dispatch: (a: StoreLib.Action) => void) => {
  filePath = normalize(filePath);
  dispatch(createOpenFileDialogOpeningFileAction({ dialogIndex: dialogIndex, filePath: filePath }));
  const req = new ReadFileRequest();
  req.filePath = filePath;
  const p1 = request(req, ResponseKind.ReadFileResponse)
  .then((response) => {
    if (responseIsOfKind(ResponseKind.ReadFileResponse)(response)) {
      try {
        const graphPayload = cbor.decode(ArrayBufferTools.getArrayBuffer(response.content));
        const graph = Graph.deserializeObject(graphPayload);
        alert(`Loaded file ${filePath}: `+JSON.stringify(graph)); // TODO non-alert message
        dispatch(createFinishDialogAction(dialogIndex));
        dispatch(createOpenGraphAction({ graph: graph }));
        //dispatch(createChangeSaViewSaGraphViewAction(originatingSaViewIndex, 0));
        // TODO change SaView
      } catch (error) {
        Log.error(`Failed to decode file ${filePath}: ${error}`);
      }
    } else handleUnexpectedResponse(response);
  }).catch(handleUnexpectedResponse);
}

// CreateOpenFileDialogAction
export enum ActionType { CreateOpenFileDialog = 'CreateOpenFileDialog' }
interface CreateOpenFileDialogAction extends CreateFileDialogAction<ActionType.CreateOpenFileDialog> {
}
function doCreateOpenFileDialogAction(state: StoreState, action: CreateOpenFileDialogAction) {
  return doCreateFileDialogAction(DialogKind.OpenFile, state, action);
}
export const createOpenFileDialog = createFileDialog(ActionType.CreateOpenFileDialog);

// OpenFileDialogOpeningFileAction
export enum ActionType { OpenFileDialogOpeningFile = 'OpenFileDialogOpeningFile' }
interface OpenFileDialogOpeningFileAction extends StoreLib.Action { type: ActionType.OpenFileDialogOpeningFile
  dialogIndex: number
  filePath: string
}
const createOpenFileDialogOpeningFileAction = (partialAction: Partial<OpenFileDialogOpeningFileAction>) => objectJoin<OpenFileDialogOpeningFileAction>({ type: ActionType.OpenFileDialogOpeningFile,
  dialogIndex: 0,
  filePath: ''
}, partialAction);
function doOpenFileDialogOpeningFileAction(state: StoreState, action: OpenFileDialogOpeningFileAction) {
  function getNewDialog(action: OpenFileDialogOpeningFileAction, dialog: OpenFileDialog): OpenFileDialog | undefined {
    return objectJoin(dialog, { fileDialogStatus: FileDialogStatus.ProcessingSubmit, filePath: action.filePath });
  }
  function getNewGraph(action: OpenFileDialogOpeningFileAction, graph: Graph): Graph | undefined {
    return new Graph();
  }
  return doFileDialogAction(state, action, dialogIsOfKind(DialogKind.OpenFile), getNewDialog, getNewGraph, undefined);
}

// Reducer:

export const reducer: Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.CreateOpenFileDialog:
      return doCreateOpenFileDialogAction(state, action as CreateOpenFileDialogAction);
    case ActionType.OpenFileDialogOpeningFile:
      return doOpenFileDialogOpeningFileAction(state, action as OpenFileDialogOpeningFileAction);
    default:
      return state;
  }
}

