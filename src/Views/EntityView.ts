import { h, UIComponent, hf } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { SaGraphView } from '../UIStore/Graphs';
import * as GraphView from '../Views/GraphView';
import * as Key from '../Key';
import { objectJoinExtend } from '../Common';
import { getDialogMappingsToSaView, shouldDialogBeVisible } from '../Dialogs/Dialog';
import { FocusTargetAreas } from '../UIStore/Focus';
import { keyup, KeyEventOptions, keydown } from 'Views/InputEventHandlers';

interface Props extends GraphView.Props {
  graphNode: GraphNode
  shouldFocus?: boolean
}

function isCurrentGraphNode(props: Props): boolean {
  if (!props.current.saGraphView.currentNode) return false;
  return props.current.saGraphView.currentNode.toString() == props.graphNode.toString();
}

function isSomeOccurenceOfCurrentGraphNode(props: Props): boolean {
  if (!props.current.saGraphView.currentNode) return false;
  return props.current.saGraphView.currentNode.getValue() == props.graphNode.getValue();
}

export class EntityView extends UIComponent<Props, { elem: HTMLElement }> {
  constructor(props?: Props, context?: any) { super(props, context); }
  render() {
    let innerProps = objectJoinExtend(this.props, {
      onComponentDidMount: (e: HTMLElement) => { 
        this.setState({ elem: e }); 
      },
      onComponentDidUpdate: (lastProps: Props, nextProps: Props) => { 
        if (isCurrentGraphNode(nextProps) && this.state && this.props.focus_.changeFocusTo 
          && this.props.focus_.changeFocusTo == FocusTargetAreas.GraphView) {
            this.state.elem.focus();
            this.props.acknowledgeFocusChange();
        }
      }
    });
    return hf(EntityViewInner, innerProps);
  }
}
function EntityViewInner(props: Props) {
  let spanProps = { 
    tabIndex: 0, 
    class: '',
    onkeyup: keyup(props, KeyEventOptions.Default),
    onkeydown: keydown(props, KeyEventOptions.Default),
    onclick: () => props.showAlertModal(props.current.saGraphView.graphIndex, "Some message "+props.graphNode.toString()+"."),
    onfocus: () => props.changeCurrentNode(props.current.saGraphViewIndex, props.graphNode)
  };
  if (isCurrentGraphNode(props)) {
    spanProps.class = 'element-selected';
  }
  else if (isSomeOccurenceOfCurrentGraphNode(props)) {
    spanProps.class = 'element-otherOccurence';
  }
  return h('span', spanProps, props.graphNode.getValue());
}
