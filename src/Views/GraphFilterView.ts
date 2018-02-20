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

function isGraphFilterConditionOfType<C extends GF.GraphFilterCondition>(
    condition: GF.GraphFilterCondition, type: GF.GraphFilterConditionType): condition is C {
  return (condition.type == type);
}

function tryRenderCondition<C extends GF.GraphFilterCondition>(props: Props, 
    c: GF.GraphFilterCondition, 
    type: GF.GraphFilterConditionType, 
    view: ((p: Props & { condition: C }) => VNode)): VNode | undefined {
  if (!isGraphFilterConditionOfType<C>(c, type)) return undefined;
  const p = objectJoinExtend(props, { condition: c });
  return renderFilter(view, p);
}

type Props = GraphViewProps;

class GraphFilterView extends UIComponent<Props, {}> {
  constructor(props: Props, context: any) {
    super(props, context);
  }
  render() {
    if (!this.props.saGraphView.filter) return h('');
    const condition = this.props.saGraphView.filter.conditions[this.props.saGraphView.filter.rootConditionIndex];
    let v = tryRenderCondition<GF.GraphFilterConditionSubjectBeginsWith>(this.props, condition,
      GF.GraphFilterConditionType.SubjectBeginsWith, GraphFilterConditionSubjectBeginsWithView);
    if (v) return v;
    v = tryRenderCondition<GF.GraphFilterConditionSubjectContains>(this.props, condition,
      GF.GraphFilterConditionType.SubjectContains, GraphFilterConditionSubjectContainsView);
    if (v) return v;
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