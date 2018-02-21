import { Graph } from '../Graphs/Graph';
import { Triple } from '../Graphs/Triple';
import { SaGraphView, State } from './Graphs';
import { StoreLib } from '../External';
import { objectJoin, arrayImmutableSet } from '../Common';

export interface GraphFilter {
  readonly conditions: GraphFilterCondition[];
  readonly rootConditionIndex: number;
}

export interface GraphFilterCondition {
  readonly type: GraphFilterConditionType
}

export function getSaGraphViewFilteredTriples(saGraphView: SaGraphView, graph: Graph): Triple[] {
  return (saGraphView.filter)
  ? applyGraphFilterCondition(graph, saGraphView.filter.conditions[saGraphView.filter.rootConditionIndex])
  : graph.get();
}

function applyGraphFilterCondition(graph: Graph, condition: GraphFilterCondition): Triple[] {
  let stringValue: string;
  switch (condition.type) {
    case GraphFilterConditionType.SubjectBeginsWith:
       stringValue = (condition as GraphFilterConditionSubjectBeginsWith).value;
      return graph.get().filter((triple) => triple.s.startsWith(stringValue));
    case GraphFilterConditionType.SubjectContains:
      stringValue = (condition as GraphFilterConditionSubjectContains).value;
      return graph.get().filter((triple) => triple.s.includes(stringValue));
    default:
      return graph.get();
  }
}

export interface GraphFilterConditionStringValue extends GraphFilterCondition {
  readonly value: string
}
function isStringValueCondition(condition: GraphFilterCondition): condition is GraphFilterConditionStringValue {
  return (condition.type === GraphFilterConditionType.SubjectBeginsWith
    || condition.type === GraphFilterConditionType.SubjectContains);
}

export enum GraphFilterConditionType {
  SubjectBeginsWith = 'SubjectBeginsWith'
}
export interface GraphFilterConditionSubjectBeginsWith extends GraphFilterConditionStringValue {
  readonly type: GraphFilterConditionType.SubjectBeginsWith
}

export enum GraphFilterConditionType {
  SubjectContains = 'SubjectContains'
}
export interface GraphFilterConditionSubjectContains extends GraphFilterConditionStringValue {
  readonly type: GraphFilterConditionType.SubjectContains
}

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

export const reducer: StoreLib.Reducer<State> = (state: State, action: StoreLib.Action) => {
  switch (action.type) {
    case ActionType.ChangeGraphFilterConditionStringValue:
      return doChangeGraphFilterConditionStringValueAction(state, action as ChangeGraphFilterConditionStringValueAction);
    default:
      return state;
  }
}
