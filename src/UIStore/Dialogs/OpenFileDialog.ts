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
import { openGraph, reducer as graphsReducer } from '../Graphs';
import * as Serializer from '../../Serialization/Serializer';
import { setChangeFocusToGraphFilter } from '../Focus';
import { changeSaViewSaGraphView, reducer as saViewsReducer } from '../SaViews';


export const openFileDialogOpenFile = (dialogIndex: number, filePath: string, originatingSaViewIndex: number) => (dispatch: (a: StoreLib.Action) => void) => {
  filePath = normalize(filePath);
  dispatch(createOpenFileDialogOpeningFileAction({ dialogIndex: dialogIndex, filePath: filePath }));
  const req = new ReadFileRequest();
  req.filePath = filePath;
  const p1 = request(req, ResponseKind.ReadFileResponse)
  .then((response) => {
    if (responseIsOfKind(ResponseKind.ReadFileResponse)(response)) {
      try {
        const graphPayload = ArrayBufferTools.toString(response.content);
        const graph = Serializer.deserialize(Graph.deserializeObject, graphPayload);
        alert(`Loaded file ${filePath}: `+graphPayload); // TODO non-alert message
        dispatch(createFinishDialogAction(dialogIndex));
        dispatch(createOpenFileDialogOpenFileAction({ originatingSaViewIndex: originatingSaViewIndex, graph: graph }));
        dispatch(setChangeFocusToGraphFilter());
      } catch (error) {
        Log.error(`Failed to decode file ${filePath}: ${error}`);
      }
    } else handleUnexpectedResponse(response);
  }).catch(handleUnexpectedResponse);
}

export const openCurrentViewAsNewGraph = (originatingSaViewIndex: number, graph: Graph) => (dispatch: (a: StoreLib.Action) => void) => {
  dispatch(createOpenFileDialogOpenFileAction({ originatingSaViewIndex: originatingSaViewIndex, graph: graph }));
  dispatch(setChangeFocusToGraphFilter());
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

// OpenFileDialogOpenFileAction
export enum ActionType { OpenFileDialogOpenFile = 'OpenFileDialogOpenFile' }
export interface OpenFileDialogOpenFileAction extends StoreLib.Action { type: ActionType.OpenFileDialogOpenFile
  originatingSaViewIndex: number,
  graph: Graph,
}
export const createOpenFileDialogOpenFileAction = (partialAction: Partial<OpenFileDialogOpenFileAction>) => objectJoin<OpenFileDialogOpenFileAction>({ type: ActionType.OpenFileDialogOpenFile,
  originatingSaViewIndex: 0,
  graph: new Graph(),
}, partialAction);
function doOpenFileDialogOpenFileAction(state: StoreState, action: OpenFileDialogOpenFileAction) {
  const newSaGraphViewIndex = state.graphs_.saGraphViews.length;
  return objectJoin<StoreState>(state, {
    graphs_: graphsReducer(state.graphs_, openGraph(action.graph)),
    saViews_: saViewsReducer(state.saViews_, changeSaViewSaGraphView({
      saViewIndex: action.originatingSaViewIndex,
      saGraphViewIndex: newSaGraphViewIndex
    }))
  });
}

// Reducer:

export const reducer: Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.CreateOpenFileDialog:
      return doCreateOpenFileDialogAction(state, action as CreateOpenFileDialogAction);
    case ActionType.OpenFileDialogOpeningFile:
      return doOpenFileDialogOpeningFileAction(state, action as OpenFileDialogOpeningFileAction);
    case ActionType.OpenFileDialogOpenFile:
      return doOpenFileDialogOpenFileAction(state, action as OpenFileDialogOpenFileAction);
    default:
      return state;
  }
}

