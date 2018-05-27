import { FileDialog, Dialogs } from '../../Dialogs/Dialog';
import { StoreState } from '../Main';
import { Graph } from '../../Graphs/Graph';
import { SaGraphView } from '../Graphs';
import { filterDownArrayToIndexed, getIndexedArray, Log, objectJoin, arrayImmutableSet } from '../../Common';

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
