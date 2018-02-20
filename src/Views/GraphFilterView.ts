import { UIComponent, h, hc, connect, StoreLib, hf, VNode } from "External";
import { Props as GraphViewProps } from "Views/GraphView";
import * as GF from "UIStore/GraphFilters";
import { objectJoinExtend } from "Common";
import { StoreState } from "UIStore/Main";

function renderFilter<Condition extends GF.GraphFilterCondition>(
    funcComp: (props: Props & { condition: Condition }) => VNode, 
    p: Props & { condition: Condition }): VNode {
  return h('div', {}, [
    "Filter: ",
    hf(funcComp, p)
  ]);
}

type Props = GraphViewProps;

class GraphFilterView extends UIComponent<Props, {}> {
  constructor(props: Props, context: any) {
    super(props, context);
  }
  render() {
    if (!this.props.saGraphView.filter) return h('');
    const condition = this.props.saGraphView.filter.conditions[this.props.saGraphView.filter.rootConditionIndex];
    if (condition.type == GF.GraphFilterConditionType.SubjectBeginsWith) {
      const c = condition as GF.GraphFilterConditionSubjectBeginsWith;
      const p = objectJoinExtend(this.props, { condition: c });
      return renderFilter(GraphFilterConditionSubjectBeginsWithView, p);
    } else if (condition.type == GF.GraphFilterConditionType.SubjectContains) {
      const c = condition as GF.GraphFilterConditionSubjectContains;
      const p = objectJoinExtend(this.props, { condition: c });
      return renderFilter(GraphFilterConditionSubjectContainsView, p);
    }
    return h('');
  }
}
export const GraphFilterComponent = connect(
  GraphFilterView,
  (state: StoreState, ownProps: GraphViewProps) => {
    return {};
  },
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps: GraphViewProps) => { 
    return {};
  });

// GraphFilterConditionViews

type PropsSubjectBeginsWithView = Props & { condition: GF.GraphFilterConditionSubjectBeginsWith }
function GraphFilterConditionSubjectBeginsWithView(props: PropsSubjectBeginsWithView) {
  if (props.condition.type != GF.GraphFilterConditionType.SubjectBeginsWith) return h('');
  return h('span', {}, 'testing');
}

type PropsSubjectContainsView = Props & { condition: GF.GraphFilterConditionSubjectContains }
function GraphFilterConditionSubjectContainsView(props: PropsSubjectContainsView) {
  if (props.condition.type != GF.GraphFilterConditionType.SubjectContains) return h('');
  return h('span', {}, 'testing2');
}