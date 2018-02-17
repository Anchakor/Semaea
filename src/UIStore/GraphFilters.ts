import { Graph } from '../Graphs/Graph';
import { Triple } from '../Graphs/Triple';
import { SaGraphView } from './Graphs';

export interface GraphFilter {
  readonly condition: GraphFilterCondition
}

export interface GraphFilterCondition {
  readonly type: GraphFilterConditionType
}

export function getSaGraphViewFilteredTriples(saGraphView: SaGraphView, graph: Graph): Triple[] {
  return (saGraphView.filter)
  ? applyGraphFilterCondition(graph, saGraphView.filter.condition)
  : graph.get();
}

function applyGraphFilterCondition(graph: Graph, condition: GraphFilterCondition): Triple[] {
  switch (condition.type) {
    case GraphFilterConditionType.SubjectBeginsWith:
      const value = (condition as SubjectBeginsWithGraphFilterCondition).value;
      return graph.get().filter((triple) => triple.s.startsWith(value));
    default:
      return graph.get();
  }
}

export enum GraphFilterConditionType {
  SubjectBeginsWith = 'SubjectBeginsWith'
}
export interface SubjectBeginsWithGraphFilterCondition {
  readonly type: GraphFilterConditionType.SubjectBeginsWith
  readonly value: string
}