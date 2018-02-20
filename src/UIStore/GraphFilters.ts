import { Graph } from '../Graphs/Graph';
import { Triple } from '../Graphs/Triple';
import { SaGraphView } from './Graphs';

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

export interface GraphFilterConditionWithStringValue {
  readonly value: string
}

export enum GraphFilterConditionType {
  SubjectBeginsWith = 'SubjectBeginsWith'
}
export interface GraphFilterConditionSubjectBeginsWith extends GraphFilterConditionWithStringValue {
  readonly type: GraphFilterConditionType.SubjectBeginsWith
}

export enum GraphFilterConditionType {
  SubjectContains = 'SubjectContains'
}
export interface GraphFilterConditionSubjectContains extends GraphFilterConditionWithStringValue {
  readonly type: GraphFilterConditionType.SubjectContains
}