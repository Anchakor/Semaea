import { StoreLib } from '../../External';
import { StoreState } from '../Main';
import { OpenFileDialog, Status as DialogStatus, DialogType, getDialogsByType } from '../../Dialogs/Dialog';
import { doCreateDialog } from '../Dialogs';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';
import { Graph } from '../../Graphs/Graph';
import { objectJoin, arrayImmutableAppend, Log, arrayImmutableSet } from '../../Common';
import { State as GraphsState } from '../Graphs';
import { request } from '../../Server/Client';
import { ListDirectoryResponse, ResponseKind, responseIsOfKind, handleUnexpectedResponse } from '../../Server/Response';
import { ListDirectoryRequest } from '../../Server/Request';

// CreateOpenFileDialogAction
export enum ActionType { CreateOpenFileDialog = 'CreateOpenFileDialog' }
export interface CreateOpenFileDialogAction extends StoreLib.Action { type: ActionType.CreateOpenFileDialog
  originatingSaViewIndex: number
  directoryPath: string
}
const createOpenFileDialogActionDefault: CreateOpenFileDialogAction = { type: ActionType.CreateOpenFileDialog, 
  originatingSaViewIndex: 0, 
  directoryPath: '.' 
};
function doCreateOpenFileDialogAction(state: StoreState, action: CreateOpenFileDialogAction) {
  const newGraph = new Graph();
  const newGraphs = arrayImmutableAppend(state.graphs_.graphs, newGraph);
  const newState = objectJoin<StoreState>(state, { 
    graphs_: objectJoin<GraphsState>(state.graphs_, { graphs: newGraphs })
  });
  const newGraphIndex = newGraphs.length - 1;

  const dialog: OpenFileDialog = { 
    status: DialogStatus.Opened, 
    type: DialogType.OpenFile,
    listDirectoryStatus: 'loading',
    directoryPath: action.directoryPath,
    createdGraphIndex: newGraphIndex,
  };
  
  return doCreateDialog(newState, 
    dialog, 
    action.originatingSaViewIndex,
    newGraphIndex);
}
export const createOpenFileDialog = (directoryPath: string, originatingSaViewIndex: number) => (dispatch: (a: StoreLib.Action) => void) => {
  dispatch(objectJoin(createOpenFileDialogActionDefault, { directoryPath: directoryPath, originatingSaViewIndex: originatingSaViewIndex }));
  const req = new ListDirectoryRequest();
    { req.dirPath = directoryPath; }
    const p1 = request(req, ResponseKind.ListDirectoryResponse)
    .then((response) => {
      if (responseIsOfKind(ResponseKind.ListDirectoryResponse)(response)) {
        const graph = new Graph();
        response.listing.forEach((v) => { // TODO use a general JSON->Graph mapper
          graph.addTriple(new Triple(v.name, 'filesystem type', v.kind));
        });
        dispatch(objectJoin(AddOpenFileDialogDirectoryListingActionDefault, { directoryPath: directoryPath, graph: graph }));
      } else {
        handleUnexpectedResponse(response);
      }
    });
}

// AddOpenFileDialogDirectoryListingAction
export enum ActionType { AddOpenFileDialogDirectoryListing = 'AddOpenFileDialogDirectoryListing' }
export interface AddOpenFileDialogDirectoryListingAction extends StoreLib.Action { type: ActionType.AddOpenFileDialogDirectoryListing
  directoryPath: string
  graph: Graph
}
export const AddOpenFileDialogDirectoryListingActionDefault: AddOpenFileDialogDirectoryListingAction = { 
  type: ActionType.AddOpenFileDialogDirectoryListing,
  directoryPath: '.',
  graph: new Graph(),
};
function doAddOpenFileDialogDirectoryListingAction(state: StoreState, action: AddOpenFileDialogDirectoryListingAction) {
  const dialog = getDialogsByType<OpenFileDialog>(state.dialogs_.dialogs, DialogType.OpenFile).find((v) => v.directoryPath == action.directoryPath && v.listDirectoryStatus == 'loading');
  // TODO this doesn't work, status is not set to done, but still 2 dialogs can be loading for same directory - use dialog index?
  if (!dialog) return state;
  const graph = state.graphs_.graphs[dialog.createdGraphIndex];
  if (!graph) return state;
  const newGraph = graph.clone();
  newGraph.merge(action.graph);
  // TODO change dialog listDirectoryStatus
  // TODO write directoryPath somewhere
  const newState = objectJoin<StoreState>(state, { 
    graphs_: objectJoin<GraphsState>(state.graphs_, { 
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

