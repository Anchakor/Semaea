import { arrayImmutableSet, objectClone, objectJoin, arrayImmutableAppend } from '../Common';
import { StoreLib, UILib, UIStoreLib } from '../External';
import { Graph } from '../Graphs/Graph';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { SaView, getClosestVisibleSaViewIndex } from '../SaViews';
import * as SaGraphViews from './Graphs/SaGraphViews';
import * as GraphFilters from './GraphFilters';

/* Graphs and SaGraphViews
Graphs are the data being displayed in Semaea in one SaGraphView.
SaGraphView has the information about how is a Graph being displayed by Semaea.
SaGraphView can be filtered to show only part of a Graph.
SaGraphViews 0..* - 1 Graph
SaGraphViews 0..1 - 0..* SaViews
*/

export interface SaGraphView {
  readonly graphIndex: number
  readonly currentNode?: GraphNode
  readonly previousNode?: GraphNode
  readonly previousNodeNonPredicate?: GraphNode
  readonly previousNodePredicate?: GraphNode
  readonly filter?: GraphFilters.GraphFilter
}

export type Graphs = (Graph | undefined)[];

export interface State {
  readonly graphs: Graphs
  readonly saGraphViews: SaGraphView[]
}
export let defaultState: State = { 
  graphs: [new Graph()],
  saGraphViews: [{ 
    graphIndex: 0,
    currentNode: undefined,
    previousNode: undefined,
    previousNodeNonPredicate: undefined,
    previousNodePredicate: undefined,
    filter: undefined
  }],
};
defaultState = doInitializeTestGraphAction(defaultState);

export function setCurrentNodeToFirstNode(saGraphView: SaGraphView, graphsState: State) {
  const graph = graphsState.graphs[saGraphView.graphIndex];
  if (!graph) return saGraphView;
  const triples = GraphFilters.getSaGraphViewFilteredTriples(saGraphView, graph);
  if (triples.length < 1) return saGraphView;
  const triple = triples[0];
  if (!triple) return saGraphView;
  return objectJoin<SaGraphView>(saGraphView, { currentNode: new GraphNode(triple, "s") });
}

// Actions:

// InitializeTestGraphAction
export enum ActionType { InitializeTestGraph = 'InitializeTestGraph' }
export interface InitializeTestGraphAction extends StoreLib.Action { type: ActionType.InitializeTestGraph
}
export const createInitializeTestGraphAction = ():InitializeTestGraphAction => ({ type: ActionType.InitializeTestGraph });
function doInitializeTestGraphAction(state: State): State {
  const graph = new Graph();
  graph.addTriple(new Triple('testS', 'testP', 'testO'));
  graph.addTriple(new Triple('testS', 'testP2', 'testO'));
  graph.addTriple(new Triple('testO', 'testP3', 'testO3'));

  const graph2 = new Graph();
  graph2.addTriple(new Triple('testS', 'testP', 'testO'));

  const newGraphs = [ graph, graph2 ];
  const newSaGraphViews = [
    objectJoin<SaGraphView>(defaultState.saGraphViews[0], { graphIndex: 0, 
      currentNode: new GraphNode(graph.getTripleAtIndex(0) as Triple, "s"),
      // TODO undo hardcoded filter
      filter: { conditions: [{ kind: GraphFilters.GraphFilterConditionKind.SubjectBeginsWith, value: "testS" } as GraphFilters.GraphFilterConditionSubjectBeginsWith], rootConditionIndex: 0 } as GraphFilters.GraphFilter
    }),
    objectJoin<SaGraphView>(defaultState.saGraphViews[0], { graphIndex: 1, 
      currentNode: new GraphNode(graph2.getTripleAtIndex(0) as Triple, "s") })
    ];

  return objectJoin(state, { graphs: newGraphs, saGraphViews: newSaGraphViews });
}

// AddTripleAction
export enum ActionType { AddTriple = 'AddTriple' }
export interface AddTripleAction extends StoreLib.Action { type: ActionType.AddTriple
  graphIndex: number
  triple: Triple
}
export const createAddTripleAction = (graphIndex: number, triple: Triple): AddTripleAction => 
  ({ type: ActionType.AddTriple, graphIndex: graphIndex, triple: triple });
export function doAddTripleAction(state: State, action: AddTripleAction) {
  const graph = state.graphs[action.graphIndex];
  if (!graph) return state;
  const newGraph = graph.clone();
  newGraph.addTriple(action.triple);
  const newGraphs = arrayImmutableSet(state.graphs, action.graphIndex, newGraph);
  return objectJoin<State>(state, { graphs: newGraphs });
}

// DeleteGraphAction
export enum ActionType { DeleteGraph = 'DeleteGraph' }
export interface DeleteGraphAction extends StoreLib.Action { type: ActionType.DeleteGraph
  graphIndex: number
}
export const createDeleteGraphAction = (graphIndex: number): DeleteGraphAction => 
  ({ type: ActionType.DeleteGraph, graphIndex: graphIndex });
function doDeleteGraphAction(state: State, action: DeleteGraphAction) {
  const newGraphs = arrayImmutableSet(state.graphs, action.graphIndex, undefined);
  return objectJoin<State>(state, { graphs: newGraphs });
}

// OpenGraphAction
export enum ActionType { OpenGraph = 'OpenGraph' }
export interface OpenGraphAction extends StoreLib.Action { type: ActionType.OpenGraph
  graph: Graph
}
export const createOpenGraphAction = (partialAction: Partial<OpenGraphAction>) => objectJoin<OpenGraphAction>({ type: ActionType.OpenGraph,
  graph: new Graph(),
}, partialAction);
export function doOpenGraphAction(state: State, action: OpenGraphAction) {
  const newGraphIndex = state.graphs.length;
  const newSaGraphView: SaGraphView = { graphIndex: newGraphIndex, 
    currentNode: new GraphNode(action.graph.getTripleAtIndex(0) as Triple, "s"),
    filter: GraphFilters.createDefaultGraphFilter(),
  };
  const newSaGraphViews = arrayImmutableAppend(state.saGraphViews, newSaGraphView);
  const newGraphs = arrayImmutableAppend(state.graphs, action.graph);
  return objectJoin<State>(state, { graphs: newGraphs, saGraphViews: newSaGraphViews });
}
//-dispatch:
//openGraph: (graph: Graph) => dispatch(createOpenGraphAction({ graph: graph }))

// Reducer:

export const reducer: StoreLib.Reducer<State> = (state: State = defaultState, action: StoreLib.Action) => {
  let newState = SaGraphViews.reducer(state, action);
  if (newState != state) { return newState; }
  newState = GraphFilters.reducer(state, action);
  if (newState != state) { return newState; }

  switch (action.type) {
    case ActionType.InitializeTestGraph:
      return doInitializeTestGraphAction(state);
    case ActionType.AddTriple:
      return doAddTripleAction(state, action as AddTripleAction);
    case ActionType.DeleteGraph:
      return doDeleteGraphAction(state, action as DeleteGraphAction);
    case ActionType.OpenGraph:
      return doOpenGraphAction(state, action as OpenGraphAction);
    default:
      return state;
  }
}
