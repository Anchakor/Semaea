import { UIComponent, h, hc, connect, StoreLib, hf, VNode } from "External";
import { Props as GraphViewProps } from "Views/GraphView";
import * as GF from "UIStore/GraphFilters";
import { objectJoinExtend } from "Common";
import { StoreState } from "UIStore/Main";

function renderFilter<Condition extends GF.GraphFilterCondition>(
    funcComp: (props: ConditionViewPropsBase & { condition: Condition }) => VNode, 
    p: ConditionViewPropsBase & { condition: Condition }): VNode {
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
    cIndex: number,
    type: GF.GraphFilterConditionType, 
    view: ((p: ConditionViewPropsBase & { condition: C }) => VNode)): VNode | undefined {
  if (!isGraphFilterConditionOfType<C>(c, type)) return undefined;
  const p = objectJoinExtend(props, { condition: c, conditionIndex: cIndex });
  return renderFilter(view, p);
}

type Props = GraphViewProps & DispatchProps;
type ConditionViewPropsBase = Props & { conditionIndex: number }

class GraphFilterView extends UIComponent<Props, {}> {
  constructor(props: Props, context: any) {
    super(props, context);
  }
  render() {
    if (!this.props.saGraphView.filter) return h('');
    const conditionIndex = this.props.saGraphView.filter.rootConditionIndex;
    const condition = this.props.saGraphView.filter.conditions[conditionIndex];
    let v = tryRenderCondition<GF.GraphFilterConditionSubjectBeginsWith>(this.props, condition, conditionIndex,
      GF.GraphFilterConditionType.SubjectBeginsWith, GraphFilterConditionSubjectBeginsWithView);
    if (v) return v;
    v = tryRenderCondition<GF.GraphFilterConditionSubjectContains>(this.props, condition, conditionIndex,
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
    return {
      changeGraphFilterConditionStringValue: (saGraphViewIndex: number, conditionIndex: number, newValue: string) => {
        const action: GF.ChangeGraphFilterConditionStringValueAction = { type: GF.ActionType.ChangeGraphFilterConditionStringValue,
          saGraphViewIndex: saGraphViewIndex, conditionIndex: conditionIndex, newValue: newValue
        }; dispatch(action); 
      }
    };
  }
);

type DispatchProps = {
  changeGraphFilterConditionStringValue: (saGraphViewIndex: number, conditionIndex: number, newValue: string) => void
}

// GraphFilterConditionViews

function renderConditionStringValueInputField(label: string, props: ConditionViewPropsBase & { condition: GF.GraphFilterConditionStringValue }) {
  return h('div', {}, [
    h('span', {}, label),
    h('input', {
      type: 'text',
      oninput: (e: Event) => props.changeGraphFilterConditionStringValue(props.saView.saGraphViewIndex, props.conditionIndex, (e.target as HTMLInputElement).value),
      value: props.condition.value
    })
  ]);
}

type PropsSubjectBeginsWithView = ConditionViewPropsBase & { condition: GF.GraphFilterConditionSubjectBeginsWith }
function GraphFilterConditionSubjectBeginsWithView(props: PropsSubjectBeginsWithView) {
  if (props.condition.type != GF.GraphFilterConditionType.SubjectBeginsWith) return h('');
  return renderConditionStringValueInputField('Subject begins with: ', props);
}

type PropsSubjectContainsView = ConditionViewPropsBase & { condition: GF.GraphFilterConditionSubjectContains }
function GraphFilterConditionSubjectContainsView(props: PropsSubjectContainsView) {
  if (props.condition.type != GF.GraphFilterConditionType.SubjectContains) return h('');
  return renderConditionStringValueInputField('Subject contains: ', props);
}

type PropsStringValueView = ConditionViewPropsBase & { condition: GF.GraphFilterConditionStringValue }
function GraphFilterConditionStringValueView(props: PropsStringValueView) {

}