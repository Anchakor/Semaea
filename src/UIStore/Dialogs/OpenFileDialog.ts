import { StoreLib, Reducer } from '../../External';
import { normalize } from 'path';
import { ReadFileRequest } from '../../Server/Request';
import { request } from '../../Server/Client';
import { ResponseKind, responseIsOfKind, handleUnexpectedResponse } from '../../Server/Response';
import { CreateFileDialogAction, doCreateFileDialogAction, createFileDialog, doFileDialogAction } from '../Dialogs/FileDialogCommon';
import { StoreState } from '../Main';
import { DialogKind, OpenFileDialog, FileDialogStatus, dialogIsOfKind } from '../../Dialogs/Dialog';
import { objectJoin } from '../../Common';
import { Graph } from '../../Graphs/Graph';


export const openFileDialogOpenFile = (dialogIndex: number, filePath: string) => (dispatch: (a: StoreLib.Action) => void) => {
  filePath = normalize(filePath);
  dispatch(createOpenFileDialogOpeningFileAction({ dialogIndex: dialogIndex, filePath: filePath }));
  const req = new ReadFileRequest();
  req.filePath = filePath;
  const p1 = request(req, ResponseKind.ReadFileResponse)
  .then((response) => {
    if (responseIsOfKind(ResponseKind.ReadFileResponse)(response)) {
      alert(`Loaded file ${filePath}: `+response.content); // TODO open file, decodig from CBOR
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

