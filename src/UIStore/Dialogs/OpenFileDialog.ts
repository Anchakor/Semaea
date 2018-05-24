import { StoreLib } from '../../External';
import { StoreState } from '../Main';
import { OpenFileDialog, Status as DialogStatus, DialogKind, dialogIsOfKind, DialogSaViewMapping } from '../../Dialogs/Dialog';
import { doCreateDialog } from '../Dialogs';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';
import { Graph } from '../../Graphs/Graph';
import { objectJoin, arrayImmutableAppend, Log, arrayImmutableSet, filterDownArray, filterDownArrayToIndexed, getIndexedArray } from '../../Common';
import { request } from '../../Server/Client';
import { ListDirectoryResponse, ResponseKind, responseIsOfKind, handleUnexpectedResponse } from '../../Server/Response';
import { ListDirectoryRequest, ReadFileRequest } from '../../Server/Request';
import { normalize } from 'path';
import { createDefaultGraphFilter } from '../GraphFilters';
import { DirectoryEntryKind, FilesystemPredicates } from '../../Entities/Filesystem';
import { SaGraphView } from '../Graphs';

export const createOpenFileDialog = (directoryPath: string, originatingSaViewIndex: number) => (dispatch: (a: StoreLib.Action) => void) => {
  directoryPath = normalize(directoryPath);
  const action = createOpenFileDialogAction({ directoryPath: directoryPath, originatingSaViewIndex: originatingSaViewIndex });
  dispatch(action);
  requestAndProcessDirectoryListing(action.syncID, directoryPath)(dispatch);
}

export const changeOpenFileDialogDirectory = (dialogIndex: number, directoryPath: string) => (dispatch: (a: StoreLib.Action) => void) => {
  directoryPath = normalize(directoryPath);
  const action = createOpenFileDialogChangeDirectoryAction({ directoryPath: directoryPath, dialogIndex: dialogIndex });
  dispatch(action);
  requestAndProcessDirectoryListing(action.syncID, directoryPath)(dispatch);
}

const requestAndProcessDirectoryListing = (syncID: number, directoryPath: string) => (dispatch: (a: StoreLib.Action) => void) => {
  const req = new ListDirectoryRequest();
  req.dirPath = directoryPath;
  const p1 = request(req, ResponseKind.ListDirectoryResponse)
  .then((response) => {
    if (responseIsOfKind(ResponseKind.ListDirectoryResponse)(response)) {
      const graph = new Graph();
      if (directoryPath != '.') {
        graph.addTriple(new Triple('..', FilesystemPredicates.DirectoryEntryKind, DirectoryEntryKind.Directory));
      }
      response.listing.forEach((v) => { // TODO use a general JSON->Graph mapper
        graph.addTriple(new Triple(v.name, FilesystemPredicates.DirectoryEntryKind, v.kind));
      });
      dispatch(createAddOpenFileDialogDirectoryListingAction({ syncID: syncID, directoryPath: directoryPath, graph: graph }));
    } else handleUnexpectedResponse(response);
  }).catch(handleUnexpectedResponse);
}

export const openFileDialogOpenFile = (dialogIndex: number, filePath: string) => (dispatch: (a: StoreLib.Action) => void) => {
  filePath = normalize(filePath);
  dispatch(createOpenFileDialogOpeningFileAction({ dialogIndex: dialogIndex, filePath: filePath }));
  const req = new ReadFileRequest();
  req.filePath = filePath;
  const p1 = request(req, ResponseKind.ReadFileResponse)
  .then((response) => {
    if (responseIsOfKind(ResponseKind.ReadFileResponse)(response)) {
      alert(`Loaded file ${filePath}: `+response.content);
    } else handleUnexpectedResponse(response);
  }).catch(handleUnexpectedResponse);
}

class SyncID {
  private static counter = 1;
  public static getNext() { return SyncID.counter++; }
}

const createGraphFilter = createDefaultGraphFilter;

// CreateOpenFileDialogAction
export enum ActionType { CreateOpenFileDialog = 'CreateOpenFileDialog' }
export interface CreateOpenFileDialogAction extends StoreLib.Action { type: ActionType.CreateOpenFileDialog
  originatingSaViewIndex: number
  directoryPath: string
  syncID: number
}
function createOpenFileDialogAction(partialAction: Partial<CreateOpenFileDialogAction>) {
  return objectJoin(objectJoin<CreateOpenFileDialogAction>({ type: ActionType.CreateOpenFileDialog, 
    originatingSaViewIndex: 0, 
    directoryPath: '.',
    syncID: 0,
  }, partialAction), { syncID: SyncID.getNext() });
}
function doCreateOpenFileDialogAction(state: StoreState, action: CreateOpenFileDialogAction) {
  const newGraph = new Graph();
  const newGraphs = arrayImmutableAppend(state.graphs_.graphs, newGraph);
  const newState = objectJoin<StoreState>(state, { 
    graphs_: objectJoin(state.graphs_, { graphs: newGraphs })
  });
  const newGraphIndex = newGraphs.length - 1;

  const dialog: OpenFileDialog = { 
    status: DialogStatus.Opened, 
    kind: DialogKind.OpenFile,
    openFileStatus: 'loadingDirectory',
    directoryPath: action.directoryPath,
    createdGraphIndex: newGraphIndex,
    syncID: action.syncID,
  };
  
  return doCreateDialog(newState, 
    dialog, 
    action.originatingSaViewIndex,
    newGraphIndex,
    createGraphFilter());
}

// OpenFileDialogChangeDirectoryAction
export enum ActionType { OpenFileDialogChangeDirectory = 'OpenFileDialogChangeDirectory' }
export interface OpenFileDialogChangeDirectoryAction extends StoreLib.Action { type: ActionType.OpenFileDialogChangeDirectory
  dialogIndex: number
  directoryPath: string
  syncID: number // this will be written, not used for searching
}
function createOpenFileDialogChangeDirectoryAction(partialAction: Partial<OpenFileDialogChangeDirectoryAction>) { 
  return objectJoin(objectJoin<OpenFileDialogChangeDirectoryAction>({ type: ActionType.OpenFileDialogChangeDirectory,
    dialogIndex: 0,
    directoryPath: '.',
    syncID: 0,
  }, partialAction), { syncID: SyncID.getNext() });
}
function doOpenFileDialogChangeDirectoryAction(state: StoreState, action: OpenFileDialogChangeDirectoryAction) {
  function getNewDialog(action: OpenFileDialogChangeDirectoryAction, dialog: OpenFileDialog): OpenFileDialog | undefined {
    return objectJoin(dialog, 
      { openFileStatus: 'loadingDirectory', directoryPath: action.directoryPath, syncID: action.syncID });
  }
  function getNewGraph(action: OpenFileDialogChangeDirectoryAction, graph: Graph): Graph | undefined {
    return new Graph();
  }
  function getNewSaGraphView(action: OpenFileDialogChangeDirectoryAction, saGraphView: SaGraphView): SaGraphView | undefined {
    // Reseting dialog filter
    return objectJoin(saGraphView, { filter: createGraphFilter() });
  }
  return doAction(state, action, getNewDialog, getNewGraph, getNewSaGraphView);
}

// AddOpenFileDialogDirectoryListingAction
export enum ActionType { AddOpenFileDialogDirectoryListing = 'AddOpenFileDialogDirectoryListing' }
export interface AddOpenFileDialogDirectoryListingAction extends StoreLib.Action { type: ActionType.AddOpenFileDialogDirectoryListing
  directoryPath: string
  graph: Graph
  syncID: number
}
function createAddOpenFileDialogDirectoryListingAction(partialAction: Partial<AddOpenFileDialogDirectoryListingAction> & { syncID: number }) {
  return objectJoin<AddOpenFileDialogDirectoryListingAction>({ 
    type: ActionType.AddOpenFileDialogDirectoryListing,
    directoryPath: '.',
    graph: new Graph(),
    syncID: partialAction.syncID
  }, partialAction);
}
function doAddOpenFileDialogDirectoryListingAction(state: StoreState, action: AddOpenFileDialogDirectoryListingAction) {
  function getNewDialog(action: AddOpenFileDialogDirectoryListingAction, dialog: OpenFileDialog): OpenFileDialog | undefined {
    return objectJoin(dialog, { openFileStatus: 'loadedDirectory' });
  }
  function getNewGraph(action: AddOpenFileDialogDirectoryListingAction, graph: Graph): Graph | undefined {
    return action.graph.clone();
  }
  return doAction(state, action, getNewDialog, getNewGraph, undefined);
}

// OpenFileDialogOpeningFileAction
export enum ActionType { OpenFileDialogOpeningFile = 'OpenFileDialogOpeningFile' }
export interface OpenFileDialogOpeningFileAction extends StoreLib.Action { type: ActionType.OpenFileDialogOpeningFile
  dialogIndex: number
  filePath: string
}
export const createOpenFileDialogOpeningFileAction = (partialAction: Partial<OpenFileDialogOpeningFileAction>) => objectJoin<OpenFileDialogOpeningFileAction>({ type: ActionType.OpenFileDialogOpeningFile,
  dialogIndex: 0,
  filePath: ''
}, partialAction);
function doOpenFileDialogOpeningFileAction(state: StoreState, action: OpenFileDialogOpeningFileAction) {
  function getNewDialog(action: OpenFileDialogOpeningFileAction, dialog: OpenFileDialog): OpenFileDialog | undefined {
    return objectJoin(dialog, { openFileStatus: 'loadingFile', filePath: action.filePath });
  }
  function getNewGraph(action: OpenFileDialogOpeningFileAction, graph: Graph): Graph | undefined {
    return new Graph();
  }
  return doAction(state, action, getNewDialog, getNewGraph, undefined);
}

// Common: 

function doAction<A>(state: StoreState, 
  action: A & { dialogIndex?: number, syncID?: number },
  getNewDialog?: (action: A, dialog: OpenFileDialog) => OpenFileDialog | undefined,
  getNewGraph?: (action: A, graph: Graph) => Graph | undefined,
  getNewSaGraphView?: (action: A, saGraphView: SaGraphView) => SaGraphView | undefined,
) {
  if (action.dialogIndex == undefined && action.syncID == undefined) {
    Log.error("Action has neither dialogIndex nor syncID, cannot find dialog: "+JSON.stringify(action));
    return state;
  }
  const dialogIndexed = filterDownArrayToIndexed(state.dialogs_.dialogs, dialogIsOfKind(DialogKind.OpenFile))
    .find((v) => ((action.dialogIndex == undefined) 
      ? v.value.syncID == action.syncID 
      : v.index == action.dialogIndex) );
  if (!dialogIndexed || !dialogIndexed.value) {
    Log.error("Dialog not found: "+JSON.stringify(action));
    return state;
  }
  const dialog = dialogIndexed.value;

  const graph = state.graphs_.graphs[dialog.createdGraphIndex];
  if (!graph) { 
    Log.error("createdGraphIndex is invalid: "+JSON.stringify(dialog)) 
    return state;
  }

  const matchingSaGraphViewIndexes = getIndexedArray(state.graphs_.saGraphViews)
    .filter((v) => v.value.graphIndex == dialog.createdGraphIndex)
    .map((v) => v.index);
  if (matchingSaGraphViewIndexes.length != 1) {
    Log.error(`Found ${matchingSaGraphViewIndexes.length} (not 1) of SaGraphViews for open file dialog: ${JSON.stringify(action)}`);
    return state; 
  }
  const saGraphViewIndex = matchingSaGraphViewIndexes[0];
  const saGraphView = state.graphs_.saGraphViews[saGraphViewIndex];

  // processing:

  let newDialogs = state.dialogs_.dialogs;
  if (getNewDialog) {
    const newDialog = getNewDialog(action, dialog);
    if (newDialog == undefined) return state;
    newDialogs = arrayImmutableSet(state.dialogs_.dialogs, dialogIndexed.index, newDialog);
  }

  let newGraphs = state.graphs_.graphs;
  if (getNewGraph) {
    const newGraph = getNewGraph(action, graph);
    if (newGraph == undefined) return state;
    newGraphs = arrayImmutableSet(state.graphs_.graphs, dialog.createdGraphIndex, newGraph);
  }

  let newSaGraphViews = state.graphs_.saGraphViews;
  if (getNewSaGraphView) {
    const newSaGraphView = getNewSaGraphView(action, saGraphView);
    if (newSaGraphView == undefined) return state;
    newSaGraphViews = arrayImmutableSet(state.graphs_.saGraphViews, saGraphViewIndex, newSaGraphView);
  }

  const newState = objectJoin<StoreState>(state, { 
    dialogs_: objectJoin(state.dialogs_, { 
      dialogs: newDialogs
    }),
    graphs_: objectJoin(state.graphs_, { 
      saGraphViews: newSaGraphViews,
      graphs: newGraphs
    }),
  });
  return newState;
}

// Reducer:

export const reducer: StoreLib.Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.CreateOpenFileDialog:
      return doCreateOpenFileDialogAction(state, action as CreateOpenFileDialogAction);
    case ActionType.AddOpenFileDialogDirectoryListing:
      return doAddOpenFileDialogDirectoryListingAction(state, action as AddOpenFileDialogDirectoryListingAction);
    case ActionType.OpenFileDialogChangeDirectory:
      return doOpenFileDialogChangeDirectoryAction(state, action as OpenFileDialogChangeDirectoryAction);
    case ActionType.OpenFileDialogOpeningFile:
      return doOpenFileDialogOpeningFileAction(state, action as OpenFileDialogOpeningFileAction);
    default:
      return state;
  }
}

