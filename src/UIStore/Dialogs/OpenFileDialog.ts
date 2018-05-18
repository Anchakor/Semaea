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

export const createOpenFileDialog = (directoryPath: string, originatingSaViewIndex: number) => (dispatch: (a: StoreLib.Action) => void) => {
  const action = createOpenFileDialogAction({ directoryPath: directoryPath, originatingSaViewIndex: originatingSaViewIndex });
  dispatch(action);
  const req = new ListDirectoryRequest();
    { req.dirPath = directoryPath; }
    const p1 = request(req, ResponseKind.ListDirectoryResponse)
    .then((response) => {
      if (responseIsOfKind(ResponseKind.ListDirectoryResponse)(response)) {
        const graph = new Graph();
        response.listing.forEach((v) => { // TODO use a general JSON->Graph mapper
          graph.addTriple(new Triple(v.name, 'filesystem type', v.kind));
        });
        dispatch(createAddOpenFileDialogDirectoryListingAction({ syncID: action.syncID, directoryPath: directoryPath, graph: graph }));
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
function createOpenFileDialogAction(p: Partial<CreateOpenFileDialogAction>): CreateOpenFileDialogAction {
  const defaultAction: CreateOpenFileDialogAction = { type: ActionType.CreateOpenFileDialog, 
    originatingSaViewIndex: 0, 
    directoryPath: '.',
    syncID: SyncID.getNext(),
  };
  return objectJoin(defaultAction, p);
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

// AddOpenFileDialogDirectoryListingAction
export enum ActionType { AddOpenFileDialogDirectoryListing = 'AddOpenFileDialogDirectoryListing' }
export interface AddOpenFileDialogDirectoryListingAction extends StoreLib.Action { type: ActionType.AddOpenFileDialogDirectoryListing
  directoryPath: string
  graph: Graph
  syncID: number
}
function createAddOpenFileDialogDirectoryListingAction(p: Partial<AddOpenFileDialogDirectoryListingAction> & { syncID: number }): AddOpenFileDialogDirectoryListingAction {
  const defaultAction: AddOpenFileDialogDirectoryListingAction = { 
    type: ActionType.AddOpenFileDialogDirectoryListing,
    directoryPath: '.',
    graph: new Graph(),
    syncID: p.syncID
  };
  return objectJoin(defaultAction, p);
}
function doAddOpenFileDialogDirectoryListingAction(state: StoreState, action: AddOpenFileDialogDirectoryListingAction) {
  const dialogIndexed = filterDownArrayToIndexed(state.dialogs_.dialogs, dialogIsOfKind(DialogKind.OpenFile))
    .find((v) => v.value.syncID == action.syncID);
  if (!dialogIndexed || !dialogIndexed.value) return state;
  const dialog = dialogIndexed.value;
  if (dialog.listDirectoryStatus != 'loading') { 
    Log.error("OpenFileDialog is receiving directory listing but is in incorrect status: "+JSON.stringify(dialog)) 
  }
  // TODO replace the graph instead of merge
  const graph = state.graphs_.graphs[dialog.createdGraphIndex];
  if (!graph) return state;
  const newGraph = graph.clone();
  newGraph.merge(action.graph);
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
    default:
      return state;
  }
}

