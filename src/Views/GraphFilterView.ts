import { UIComponent, h, hc, connect, StoreLib, hf, VNode } from '../External';
import { Props as GraphViewProps } from './GraphView';
import * as GF from '../UIStore/GraphFilters';
import { objectJoinExtend } from '../Common';
import { StoreState } from '../UIStore/Main';
import { TextInputKeyEventOptions } from './InputEventHandlers';
import { createFocusableElementProps } from './FocusableElementProps';
import { graphFilterConditionIsOfKind } from '../UIStore/GraphFilters';

function renderFilter(conditionView: VNode): VNode {
  return h('div', {}, [
    'Filter: ',
    conditionView
  ]);
}

type Props = GraphViewProps & DispatchProps;
type ConditionViewPropsBase = Props & { conditionIndex: number }

class GraphFilterView extends UIComponent<Props, {}> {
  constructor(props: Props, context: any) {
    super(props, context);
  }
  render() {
    const filter = this.props.current.saGraphView.filter;
    if (!filter) return h('');
    const conditionIndex = filter.rootConditionIndex;
    const condition = filter.conditions[conditionIndex];
    if (graphFilterConditionIsOfKind(GF.GraphFilterConditionKind.SubjectBeginsWith)(condition)) {
      const conditionProps = objectJoinExtend(this.props, { condition: condition, conditionIndex: conditionIndex });
      return renderFilter(hf(GraphFilterConditionSubjectBeginsWithView, conditionProps));
    } else if (graphFilterConditionIsOfKind(GF.GraphFilterConditionKind.SubjectContains)(condition)) {
      const conditionProps = objectJoinExtend(this.props, { condition: condition, conditionIndex: conditionIndex });
      return renderFilter(hf(GraphFilterConditionSubjectContainsView, conditionProps));
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
    h('input', createFocusableElementProps(TextInputKeyEventOptions, props, {
      type: 'text',
      oninput: (e: Event) => props.changeGraphFilterConditionStringValue(props.current.saGraphViewIndex, props.conditionIndex, (e.target as HTMLInputElement).value),
      value: props.condition.value
    }))
  ]);
}

type PropsSubjectBeginsWithView = ConditionViewPropsBase & { condition: GF.GraphFilterConditionSubjectBeginsWith }
function GraphFilterConditionSubjectBeginsWithView(props: PropsSubjectBeginsWithView) {
  if (props.condition.kind != GF.GraphFilterConditionKind.SubjectBeginsWith) return h('');
  return renderConditionStringValueInputField('Subject begins with: ', props);
}

type PropsSubjectContainsView = ConditionViewPropsBase & { condition: GF.GraphFilterConditionSubjectContains }
function GraphFilterConditionSubjectContainsView(props: PropsSubjectContainsView) {
  if (props.condition.kind != GF.GraphFilterConditionKind.SubjectContains) return h('');
  return renderConditionStringValueInputField('Subject contains: ', props);
}
