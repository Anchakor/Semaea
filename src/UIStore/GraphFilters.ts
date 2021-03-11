import { Graph } from '../Graphs/Graph';
import { Triple } from '../Graphs/Triple';
import { SaGraphView, defaultState } from './Graphs';
import { UIStoreTools } from '../External';
import { checkKindFor, objectClone } from '../Common';
import { createSlice } from '@reduxjs/toolkit';

/*
GraphFilters and GraphFilterConditions
GraphFilter defines how Graph is filtered to display only part of it in SaGraphView.
GraphFilterConditions define how Graph is filtered, some being container conditions which link to other conditions (AND, OR operations) forming a hierarchy.
*/

export interface GraphFilter {
  readonly conditions: GraphFilterCondition[];
  readonly rootConditionIndex: number;
}

export interface GraphFilterCondition {
  readonly kind: GraphFilterConditionKind
}

export const graphFilterConditionIsOfKind = checkKindFor<GraphFilterConditionKinds>();

export function getSaGraphViewFilteredTriples(saGraphView: SaGraphView, graph: Graph): Triple[] {
  return (saGraphView.filter)
  ? applyGraphFilterCondition(graph, saGraphView.filter.conditions[saGraphView.filter.rootConditionIndex])
  : graph.get();
}

function applyGraphFilterCondition(graph: Graph, condition: GraphFilterCondition): Triple[] {
  let stringValue: string;
  switch (condition.kind) {
    case GraphFilterConditionKind.SubjectBeginsWith:
       stringValue = (condition as GraphFilterConditionSubjectBeginsWith).value;
      return graph.get().filter((triple) => triple.s.toLowerCase().startsWith(stringValue.toLowerCase()));
    case GraphFilterConditionKind.SubjectContains:
      stringValue = (condition as GraphFilterConditionSubjectContains).value;
      return graph.get().filter((triple) => triple.s.toLowerCase().includes(stringValue.toLowerCase()));
    default:
      return graph.get();
  }
}

export function createDefaultGraphFilter() {
  const c: GraphFilterConditionSubjectContains = { 
    kind: GraphFilterConditionKind.SubjectContains,
    value: ''
  };
  const f: GraphFilter = { conditions: [ c ], rootConditionIndex: 0 };
  return f;
}

export function cloneGraphFilter(filter: GraphFilter): GraphFilter {
  return {
    conditions: filter.conditions.map((v) => objectClone(v)),
    rootConditionIndex: filter.rootConditionIndex,
  }
}

// CONDITIONS:

type GraphFilterConditionKinds = GraphFilterCondition
  | GraphFilterConditionSubjectBeginsWith
  | GraphFilterConditionSubjectContains

export interface GraphFilterConditionStringValue extends GraphFilterCondition {
  value: string
}
function isStringValueCondition(condition: GraphFilterCondition): condition is GraphFilterConditionStringValue {
  return (condition.kind === GraphFilterConditionKind.SubjectBeginsWith
    || condition.kind === GraphFilterConditionKind.SubjectContains);
}

export enum GraphFilterConditionKind {
  SubjectBeginsWith = 'SubjectBeginsWith'
}
export interface GraphFilterConditionSubjectBeginsWith extends GraphFilterConditionStringValue {
  readonly kind: GraphFilterConditionKind.SubjectBeginsWith
}

export enum GraphFilterConditionKind {
  SubjectContains = 'SubjectContains'
}
export interface GraphFilterConditionSubjectContains extends GraphFilterConditionStringValue {
  readonly kind: GraphFilterConditionKind.SubjectContains
}

// TODO container conditions (AND, OR)

const slice = createSlice({
  name: 'GraphFilters',
  initialState: defaultState,
  reducers: {
    changeGraphFilterConditionStringValue: (state, a: UIStoreTools.PayloadAction<{
      saGraphViewIndex: number
      conditionIndex: number
      newValue: string
    }>) => {
      const condition = state.saGraphViews[a.payload.saGraphViewIndex].filter?.conditions[a.payload.conditionIndex];
      if (!condition || !isStringValueCondition(condition)) return;
      condition.value = a.payload.newValue;
    }
  }
});

export const { changeGraphFilterConditionStringValue } = slice.actions;

export const reducer = slice.reducer;

/*
// Actions:

// ChangeGraphFilterConditionStringValueAction
export enum ActionType { ChangeGraphFilterConditionStringValue = 'ChangeGraphFilterConditionStringValue' }
export interface ChangeGraphFilterConditionStringValueAction extends StoreLib.Action { type: ActionType.ChangeGraphFilterConditionStringValue
  saGraphViewIndex: number
  conditionIndex: number
  newValue: string
}
function doChangeGraphFilterConditionStringValueAction(state: State, action: ChangeGraphFilterConditionStringValueAction): State {
  const saGraphView = state.saGraphViews[action.saGraphViewIndex];
  if (!saGraphView || !saGraphView.filter) return state;
  const condition = saGraphView.filter.conditions[action.conditionIndex];
  if (!condition || !isStringValueCondition(condition)) return state;
  const newCondition = objectJoin<GraphFilterConditionStringValue>(condition, { value: action.newValue });
  const newFilter = objectJoin<GraphFilter>(saGraphView.filter, {
    conditions: arrayImmutableSet(saGraphView.filter.conditions, action.conditionIndex, newCondition)
  });
  const newSaGraphView = objectJoin<SaGraphView>(saGraphView, { filter: newFilter });
  return objectJoin<State>(state, { saGraphViews: arrayImmutableSet(state.saGraphViews, action.saGraphViewIndex, newSaGraphView) });
}

// Reducer:

export const reducer: Reducer<State> = (state: State, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.ChangeGraphFilterConditionStringValue:
      return doChangeGraphFilterConditionStringValueAction(state, action as ChangeGraphFilterConditionStringValueAction);
    default:
      return state;
  }
}
*/