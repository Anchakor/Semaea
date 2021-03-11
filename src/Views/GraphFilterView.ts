import { UIComponent, h, hc, connect, hf, VNode } from '../External';
import { Props as GraphViewProps } from './GraphView';
import * as GF from '../UIStore/GraphFilters';
import { objectJoinExtend } from '../Common';
import { StoreState, DispatchProps, getDispatchProps } from '../UIStore/Main';
import { TextInputKeyEventOptions } from './InputEventHandlers';
import { createFocusableElementProps } from './FocusableElementProps';
import { graphFilterConditionIsOfKind } from '../UIStore/GraphFilters';
import { FocusTarget } from '../UIStore/Focus';
import { withFocusable } from './FocusableComponent';

function renderFilter(conditionView: VNode): VNode {
  return h('div', {}, [
    'Filter: ',
    conditionView
  ]);
}

type Props = GraphViewProps & DispatchProps;
type ConditionViewProps<GCT extends GF.GraphFilterCondition> = DispatchProps &
  { saGraphViewIndex: number, conditionIndex: number, condition: GCT }

class GraphFilterView extends UIComponent<Props, {}> {
  constructor(props: Props, context: unknown) {
    super(props, context);
  }
  render() {
    const filter = this.props.current.saGraphView.filter;
    if (!filter) return h('');
    const conditionIndex = filter.rootConditionIndex;
    const condition = filter.conditions[conditionIndex];
    const propsBase = { 
      //focus_: this.props.focus_,
      dispatch: this.props.dispatch, 
      saGraphViewIndex: this.props.current.saGraphViewIndex, 
      conditionIndex: conditionIndex, 
    };
    // TODO don't focus conditions past the first one
    if (graphFilterConditionIsOfKind(GF.GraphFilterConditionKind.SubjectBeginsWith)(condition)) {
      const conditionViewProps = objectJoinExtend(propsBase, { condition: condition });
      return renderFilter(hf(GraphFilterConditionSubjectBeginsWithView, conditionViewProps));
    } else if (graphFilterConditionIsOfKind(GF.GraphFilterConditionKind.SubjectContains)(condition)) {
      const conditionViewProps = objectJoinExtend(propsBase, { condition: condition });
      return renderFilter(hf(GraphFilterConditionSubjectContainsView, conditionViewProps));
    } else {
      return h('');
    }
  }
}
export const GraphFilterComponent = connect(
  GraphFilterView,
  (state: StoreState, ownProps: GraphViewProps) => {
    return {};
  },
  getDispatchProps);

// GraphFilterConditionViews

function renderConditionStringValueInputField(label: string, props: ConditionViewProps<GF.GraphFilterConditionStringValue>) {
  return h('div', {}, [
    h('span', {}, label+': '),
    hc(ConditionStringValueInputFieldComponent, objectJoinExtend(props, { name: label }))
  ]);
}
type ConditionStringValueInputFieldComponentProps<GCT extends GF.GraphFilterConditionStringValue> 
  = ConditionViewProps<GCT> & { name: string }
const ConditionStringValueInputFieldComponent = withFocusable(
  (props: ConditionStringValueInputFieldComponentProps<GF.GraphFilterConditionStringValue>) => h(
    'input', 
    createFocusableElementProps(TextInputKeyEventOptions, props, {
      type: 'text',
      oninput: (e: Event) => {
        props.dispatch(GF.changeGraphFilterConditionStringValue({
          saGraphViewIndex: props.saGraphViewIndex, 
          conditionIndex: props.conditionIndex, 
          newValue: (e.target as HTMLInputElement).value
        })); 
      },
      value: props.condition.value
    })
  ),
  FocusTarget.GraphFilter,
  (props: ConditionStringValueInputFieldComponentProps<GF.GraphFilterConditionStringValue>) => 'GraphFilterCondition '+props.name
)

function GraphFilterConditionSubjectBeginsWithView(props: ConditionViewProps<GF.GraphFilterConditionSubjectBeginsWith>) {
  if (props.condition.kind != GF.GraphFilterConditionKind.SubjectBeginsWith) return h('');
  return renderConditionStringValueInputField('Subject begins with', props);
}

function GraphFilterConditionSubjectContainsView(props: ConditionViewProps<GF.GraphFilterConditionSubjectContains>) {
  if (props.condition.kind != GF.GraphFilterConditionKind.SubjectContains) return h('');
  return renderConditionStringValueInputField('Subject contains', props);
}
