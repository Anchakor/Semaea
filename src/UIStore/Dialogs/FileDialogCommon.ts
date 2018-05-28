import { FileDialog, Dialogs, FileDialogStatus, Status as DialogStatus, DialogKind, isFileDialog } from '../../Dialogs/Dialog';
import { StoreState } from '../Main';
import { Graph } from '../../Graphs/Graph';
import { SaGraphView } from '../Graphs';
import { filterDownArrayToIndexed, getIndexedArray, Log, objectJoin, arrayImmutableSet, arrayImmutableAppend } from '../../Common';
import { StoreLib, Reducer } from '../../External';
import { normalize } from 'path';
import { ListDirectoryRequest } from '../../Server/Request';
import { request } from '../../Server/Client';
import { ResponseKind, responseIsOfKind, handleUnexpectedResponse } from '../../Server/Response';
import { Triple } from '../../Graphs/Triple';
import { FilesystemPredicates, DirectoryEntryKind } from '../../Entities/Filesystem';
import { createDefaultGraphFilter } from '../GraphFilters';
import { doCreateDialog } from '../Dialogs';

export const createFileDialog = <AT>(type: AT) => (directoryPath: string, originatingSaViewIndex: number) => (dispatch: (a: StoreLib.Action) => void) => {
  directoryPath = normalize(directoryPath);
  const action = createFileDialogAction({ type: type, directoryPath: directoryPath, originatingSaViewIndex: originatingSaViewIndex });
  dispatch(action);
  requestAndProcessDirectoryListing(action.syncID, directoryPath)(dispatch);
}

export const changeFileDialogDirectory = (dialogIndex: number, directoryPath: string) => (dispatch: (a: StoreLib.Action) => void) => {
  directoryPath = normalize(directoryPath);
  const action = createChangeFileDialogDirectoryAction({ directoryPath: directoryPath, dialogIndex: dialogIndex });
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
      dispatch(createSetFileDialogDirectoryListingAction({ syncID: syncID, directoryPath: directoryPath, graph: graph }));
    } else handleUnexpectedResponse(response);
  }).catch(handleUnexpectedResponse);
}

export class FileDialogSyncID {
  private static counter = 1;
  public static getNext() { return FileDialogSyncID.counter++; }
}

const createGraphFilter = createDefaultGraphFilter;

// CreateFileDialogAction
export interface CreateFileDialogAction<AT> extends StoreLib.Action { type: AT
  originatingSaViewIndex: number
  directoryPath: string
  syncID: number
}
function createFileDialogAction<AT>(partialAction: Partial<CreateFileDialogAction<AT>> & { type: AT }) {
  return objectJoin(objectJoin<CreateFileDialogAction<AT>>({ type: partialAction.type,
    originatingSaViewIndex: 0, 
    directoryPath: '.',
    syncID: 0,
  }, partialAction), { syncID: FileDialogSyncID.getNext() });
}
export function doCreateFileDialogAction<AT>(dialogKind: DialogKind, state: StoreState, action: CreateFileDialogAction<AT>) {
  const newGraph = new Graph();
  const newGraphs = arrayImmutableAppend(state.graphs_.graphs, newGraph);
  const newState = objectJoin<StoreState>(state, { 
    graphs_: objectJoin(state.graphs_, { graphs: newGraphs })
  });
  const newGraphIndex = newGraphs.length - 1;

  const dialog: FileDialog = { 
    status: DialogStatus.Opened, 
    kind: dialogKind,
    fileDialogStatus: FileDialogStatus.LoadingDirectory,
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

// ChangeFileDialogDirectoryAction
export enum ActionType { ChangeFileDialogDirectory = 'ChangeFileDialogDirectory' }
interface ChangeFileDialogDirectoryAction extends StoreLib.Action { type: ActionType.ChangeFileDialogDirectory
  dialogIndex: number
  directoryPath: string
  syncID: number // this will be written, not used for searching
}
function createChangeFileDialogDirectoryAction(partialAction: Partial<ChangeFileDialogDirectoryAction>) { 
  return objectJoin(objectJoin<ChangeFileDialogDirectoryAction>({ type: ActionType.ChangeFileDialogDirectory,
    dialogIndex: 0,
    directoryPath: '.',
    syncID: 0,
  }, partialAction), { syncID: FileDialogSyncID.getNext() });
}
function doChangeFileDialogDirectoryAction(state: StoreState, action: ChangeFileDialogDirectoryAction) {
  function getNewDialog(action: ChangeFileDialogDirectoryAction, dialog: FileDialog): FileDialog | undefined {
    return objectJoin(dialog, 
      { fileDialogStatus: FileDialogStatus.LoadingDirectory, directoryPath: action.directoryPath, syncID: action.syncID });
  }
  function getNewGraph(action: ChangeFileDialogDirectoryAction, graph: Graph): Graph | undefined {
    return new Graph();
  }
  function getNewSaGraphView(action: ChangeFileDialogDirectoryAction, saGraphView: SaGraphView): SaGraphView | undefined {
    // Reseting dialog filter
    return objectJoin(saGraphView, { filter: createGraphFilter() });
  }
  return doFileDialogAction(state, action, isFileDialog, getNewDialog, getNewGraph, getNewSaGraphView);
}

// SetFileDialogDirectoryListingAction
export enum ActionType { SetFileDialogDirectoryListing = 'SetFileDialogDirectoryListing' }
interface SetFileDialogDirectoryListingAction extends StoreLib.Action { type: ActionType.SetFileDialogDirectoryListing
  directoryPath: string
  graph: Graph
  syncID: number
}
function createSetFileDialogDirectoryListingAction(partialAction: Partial<SetFileDialogDirectoryListingAction> & { syncID: number }) {
  return objectJoin<SetFileDialogDirectoryListingAction>({ 
    type: ActionType.SetFileDialogDirectoryListing,
    directoryPath: '.',
    graph: new Graph(),
    syncID: partialAction.syncID
  }, partialAction);
}
function doSetFileDialogDirectoryListingAction(state: StoreState, action: SetFileDialogDirectoryListingAction) {
  function getNewDialog(action: SetFileDialogDirectoryListingAction, dialog: FileDialog): FileDialog | undefined {
    return objectJoin(dialog, { fileDialogStatus: FileDialogStatus.LoadedDirectory });
  }
  function getNewGraph(action: SetFileDialogDirectoryListingAction, graph: Graph): Graph | undefined {
    return action.graph.clone();
  }
  return doFileDialogAction(state, action, isFileDialog, getNewDialog, getNewGraph, undefined);
}

// Reducer helper

export function doFileDialogAction<A, D extends FileDialog>(state: StoreState, 
  action: A & { dialogIndex?: number, syncID?: number },
  dialogKindTypeGuard: (dialog: Dialogs) => dialog is D,
  getNewDialog?: (action: A, dialog: D) => D | undefined,
  getNewGraph?: (action: A, graph: Graph) => Graph | undefined,
  getNewSaGraphView?: (action: A, saGraphView: SaGraphView) => SaGraphView | undefined,
) {
  if (action.dialogIndex == undefined && action.syncID == undefined) {
    Log.error("Action has neither dialogIndex nor syncID, cannot find dialog: "+JSON.stringify(action));
    return state;
  }
  const dialogIndexed = filterDownArrayToIndexed(state.dialogs_.dialogs, dialogKindTypeGuard)
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

export const reducer: Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.SetFileDialogDirectoryListing:
      return doSetFileDialogDirectoryListingAction(state, action as SetFileDialogDirectoryListingAction);
    case ActionType.ChangeFileDialogDirectory:
      return doChangeFileDialogDirectoryAction(state, action as ChangeFileDialogDirectoryAction);
    default:
      return state;
  }
}