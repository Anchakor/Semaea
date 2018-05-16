import { UIComponent, h, hc, connect, StoreLib, hf, VNode } from '../External';
import { Props as GraphViewProps } from './GraphView';
import * as GF from '../UIStore/GraphFilters';
import { objectJoinExtend } from '../Common';
import { StoreState } from '../UIStore/Main';
import { TextInputKeyEventOptions } from './InputEventHandlers';
import { createFocusableElementProps } from './FocusableElementProps';
import { graphFilterConditionIsOfKind } from '../UIStore/GraphFilters';
import { FocusableComponent } from 'Views/DialogView';

function renderFilter(conditionView: VNode): VNode {
  return h('div', {}, [
    'Filter: ',
    conditionView
  ]);
}

type Props = GraphViewProps & DispatchProps;
type ConditionViewProps<GCT extends GF.GraphFilterCondition> = Props & { conditionIndex: number, condition: GCT }

class GraphFilterView extends UIComponent<Props, {}> {
  constructor(props: Props, context: any) {
    super(props, context);
  }
  render() {
    const filter = this.props.current.saGraphView.filter;
    if (!filter) return h('');
    const conditionIndex = filter.rootConditionIndex;
    const condition = filter.conditions[conditionIndex];
    // TODO don't focus conditions past the first one
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

function renderConditionStringValueInputField(label: string, props: ConditionViewProps<GF.GraphFilterConditionStringValue>) {
  return h('div', {}, [
    h('span', {}, label+': '),
    hc(ConditionStringValueInputFieldComponent, objectJoinExtend(props, { dontFocus: false, name: label }))
    // TODO don't focus for dialogs where the cancel button is supposed to be focused
  ]);
}
type ConditionStringValueInputFieldComponentProps<GCT extends GF.GraphFilterConditionStringValue> 
  = ConditionViewProps<GCT> & { dontFocus?: boolean, name?: string }
class ConditionStringValueInputFieldComponent<GCT extends GF.GraphFilterConditionStringValue> 
  extends FocusableComponent<ConditionStringValueInputFieldComponentProps<GCT>> {
  constructor(props: ConditionStringValueInputFieldComponentProps<GCT>, context?: any) { 
    super(props, context);
    if (props.name) { this.innerComponentName = 'GraphFilterCondition '+props.name }
  }
  readonly innerComponent = (props: ConditionStringValueInputFieldComponentProps<GCT>) => h(
    'input', 
    createFocusableElementProps(TextInputKeyEventOptions, props, {
      type: 'text',
      oninput: (e: Event) => props.changeGraphFilterConditionStringValue(props.current.saGraphViewIndex, props.conditionIndex, (e.target as HTMLInputElement).value),
      value: props.condition.value
    })
  )
}

function GraphFilterConditionSubjectBeginsWithView(props: ConditionViewProps<GF.GraphFilterConditionSubjectBeginsWith>) {
  if (props.condition.kind != GF.GraphFilterConditionKind.SubjectBeginsWith) return h('');
  return renderConditionStringValueInputField('Subject begins with', props);
}

function GraphFilterConditionSubjectContainsView(props: ConditionViewProps<GF.GraphFilterConditionSubjectContains>) {
  if (props.condition.kind != GF.GraphFilterConditionKind.SubjectContains) return h('');
  return renderConditionStringValueInputField('Subject contains', props);
}
