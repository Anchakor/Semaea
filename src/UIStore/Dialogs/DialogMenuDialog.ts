import { StoreLib, Reducer } from '../../External';
import { StoreState } from '../Main';
import { DialogMenuDialog, Status as DialogStatus, DialogKind } from '../../Dialogs/Dialog';
import { doCreateDialog } from '../Dialogs';
import { GraphNode } from '../../Graphs/GraphNode';
import { Triple } from '../../Graphs/Triple';
import { Graph } from '../../Graphs/Graph';
import { objectJoin, arrayImmutableAppend } from '../../Common';
import { State as GraphsState } from '../Graphs';
import { createDefaultGraphFilter } from 'UIStore/GraphFilters';

// CreateDialogMenuDialogAction
export enum ActionType { CreateDialogMenuDialog = 'CreateDialogMenuDialog' }
export interface CreateDialogMenuDialogAction extends StoreLib.Action { type: ActionType.CreateDialogMenuDialog
  originatingSaViewIndex: number
}
export const createCreateDialogMenuDialogAction = (originatingSaViewIndex: number): CreateDialogMenuDialogAction => 
  ({ type: ActionType.CreateDialogMenuDialog, originatingSaViewIndex: originatingSaViewIndex });
function doCreateDialogMenuDialogAction(state: StoreState, action: CreateDialogMenuDialogAction) {
  const newGraph = new Graph();
  newGraph.addTriple(new Triple("Add triple", "a", "DialogMenuOption"));
  newGraph.addTriple(new Triple("Delete graph", "a", "DialogMenuOption"));
  newGraph.addTriple(new Triple("Open file", "a", "DialogMenuOption"));
  newGraph.addTriple(new Triple("Save file", "a", "DialogMenuOption"));

  const newGraphs = arrayImmutableAppend(state.graphs_.graphs, newGraph);
  const newState = objectJoin<StoreState>(state, { 
    graphs_: objectJoin<GraphsState>(state.graphs_, { graphs: newGraphs })
  });
  const newGraphIndex = newGraphs.length - 1;

  const dialog: DialogMenuDialog = { 
    status: DialogStatus.Opened, 
    kind: DialogKind.DialogMenu,
    selectedDialog: undefined,
    createdGraphIndex: newGraphIndex
  };
  
  return doCreateDialog(newState, 
    dialog, 
    action.originatingSaViewIndex,
    newGraphIndex,
    createDefaultGraphFilter());
}

// Reducer:

export const reducer: Reducer<StoreState> = (state: StoreState, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.CreateDialogMenuDialog:
      return doCreateDialogMenuDialogAction(state, action as CreateDialogMenuDialogAction);
    default:
      return state;
  }
}

