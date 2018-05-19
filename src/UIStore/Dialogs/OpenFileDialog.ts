import { StoreLib } from '../../External';
import { StoreState } from '../Main';
import { OpenFileDialog, Status as DialogStatus, DialogKind, dialogIsOfKind } from '../../Dialogs/Dialog';
import { doCreateDialog } from '../Dialogs';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';
import { Graph } from '../../Graphs/Graph';
import { objectJoin, arrayImmutableAppend, Log, arrayImmutableSet, filterDownArray, filterDownArrayToIndexed } from '../../Common';
import { request } from '../../Server/Client';
import { ListDirectoryResponse, ResponseKind, responseIsOfKind, handleUnexpectedResponse } from '../../Server/Response';
import { ListDirectoryRequest } from '../../Server/Request';
import { normalize } from 'path';

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
        graph.addTriple(new Triple('..', 'filesystem type', 'directory'));
      }
      response.listing.forEach((v) => { // TODO use a general JSON->Graph mapper
        graph.addTriple(new Triple(v.name, 'filesystem type', v.kind));
      });
      dispatch(createAddOpenFileDialogDirectoryListingAction({ syncID: syncID, directoryPath: directoryPath, graph: graph }));
    } else {
      handleUnexpectedResponse(response);
    }
  });
}

class SyncID {
  private static counter = 1;
  public static getNext() { return SyncID.counter++; }
}

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
    listDirectoryStatus: 'loading',
    directoryPath: action.directoryPath,
    createdGraphIndex: newGraphIndex,
    syncID: action.syncID,
  };
  
  return doCreateDialog(newState, 
    dialog, 
    action.originatingSaViewIndex,
    newGraphIndex);
}

// OpenFileDialogChangeDirectoryAction
export enum ActionType { OpenFileDialogChangeDirectory = 'OpenFileDialogChangeDirectory' }
export interface OpenFileDialogChangeDirectoryAction extends StoreLib.Action { type: ActionType.OpenFileDialogChangeDirectory
  dialogIndex: number
  directoryPath: string
  syncID: number
}
function createOpenFileDialogChangeDirectoryAction(partialAction: Partial<OpenFileDialogChangeDirectoryAction>) { 
  return objectJoin(objectJoin<OpenFileDialogChangeDirectoryAction>({ type: ActionType.OpenFileDialogChangeDirectory,
    dialogIndex: 0,
    directoryPath: '.',
    syncID: 0,
  }, partialAction), { syncID: SyncID.getNext() });
}
function doOpenFileDialogChangeDirectoryAction(state: StoreState, action: OpenFileDialogChangeDirectoryAction) {
  const dialogIndexed = filterDownArrayToIndexed(state.dialogs_.dialogs, dialogIsOfKind(DialogKind.OpenFile))
    .find((v) => v.index == action.dialogIndex);
  if (!dialogIndexed || !dialogIndexed.value) {
    Log.error("Dialog not found: "+JSON.stringify(action));
    return state;
  }
  const dialog = dialogIndexed.value;
  const newDialog = objectJoin(dialog, { listDirectoryStatus: 'loading', 
    directoryPath: action.directoryPath, syncID: action.syncID });
  const newState = objectJoin<StoreState>(state, { 
    dialogs_: objectJoin(state.dialogs_, { 
      dialogs: arrayImmutableSet(state.dialogs_.dialogs, dialogIndexed.index, newDialog)
    }),
  });
  return newState;
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
  const dialogIndexed = filterDownArrayToIndexed(state.dialogs_.dialogs, dialogIsOfKind(DialogKind.OpenFile))
    .find((v) => v.value.syncID == action.syncID);
  if (!dialogIndexed || !dialogIndexed.value) return state;
  const dialog = dialogIndexed.value;
  if (dialog.listDirectoryStatus != 'loading') { 
    Log.error("Not in 'loading' status: "+JSON.stringify(dialog)) 
  }
  const graph = state.graphs_.graphs[dialog.createdGraphIndex];
  if (!graph) { 
    Log.error("createdGraphIndex is invalid: "+JSON.stringify(dialog)) 
    return state;
  }
  const newGraph = action.graph.clone();
  const newDialog = objectJoin(dialog, { listDirectoryStatus: 'loaded' });
  const newState = objectJoin<StoreState>(state, { 
    dialogs_: objectJoin(state.dialogs_, { 
      dialogs: arrayImmutableSet(state.dialogs_.dialogs, dialogIndexed.index, newDialog)
    }),
    graphs_: objectJoin(state.graphs_, { 
      graphs: arrayImmutableSet(state.graphs_.graphs, dialog.createdGraphIndex, newGraph)
    })
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
    default:
      return state;
  }
}

