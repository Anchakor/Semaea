import { UIComponent, h, hc } from "External";
import { Props } from "Views/GraphView";
import * as GF from "UIStore/GraphFilters";
import { objectJoinExtend } from "Common";

export function GraphFilterView(props: Props) {
  if (!props.saGraphView.filter) return h('');
  const condition = props.saGraphView.filter.condition;
  if (condition.type == GF.GraphFilterConditionType.SubjectBeginsWith) {
    const c = condition as GF.GraphFilterConditionSubjectBeginsWith;
    const p = objectJoinExtend(props, { condition: c });
    return hc(GraphFilterConditionSubjectBeginsWithView, p);
  }
  return h('');
}

type PropsSubjectBeginsWithView = Props & { condition: GF.GraphFilterConditionSubjectBeginsWith }
export class GraphFilterConditionSubjectBeginsWithView extends UIComponent<PropsSubjectBeginsWithView, {}> {
  constructor(props?: PropsSubjectBeginsWithView, context?: any) { super(props, context); }
  public render() {
    if (this.props.condition.type != GF.GraphFilterConditionType.SubjectBeginsWith) return;
    return h('div', {}, 'testing');
  }
}