import { h, UIComponent, hf, linkEvent } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { SaGraphView } from '../UIStore/Graphs';
import * as GraphView from './GraphView';
import * as Key from '../Key';
import { objectJoinExtend } from '../Common';
import { getDialogMappingsToSaView, shouldDialogBeVisible } from '../Dialogs/Dialog';
import { FocusTarget } from '../UIStore/Focus';
import { KeyEventOptions } from './InputEventHandlers';
import { createFocusableElementProps } from './FocusableElementProps';
import { FocusableComponent } from './FocusableComponent';

interface Props extends GraphView.Props {
  graphNode: GraphNode
  shouldFocus?: boolean
}

function isCurrentGraphNode(props: Props): boolean {
  if (!props.current.saGraphView.currentNode) return false;
  return props.current.saGraphView.currentNode.equals(props.graphNode);
}

function isSomeOccurenceOfCurrentGraphNode(props: Props): boolean {
  if (!props.current.saGraphView.currentNode) return false;
  return props.current.saGraphView.currentNode.getValue() == props.graphNode.getValue();
}

/** Empty focusable element for all GraphView entities (GraphNodes) */
export class EntityFocusableView extends FocusableComponent<Props> {
  constructor(props: Props, context?: any) { super(props, context); }
  focusTarget = FocusTarget.GraphView
  innerComponentName = 'Graph View EntityFocusableView'
  innerComponent = (p: Props) => h('span', createFocusableElementProps(KeyEventOptions.Default, p, { tabindex: 0 }));
}

export function entityView(props: Props) {
  let spanProps = createFocusableElementProps(KeyEventOptions.Default, props, { 
    class: '',
    onclick: linkEvent(props, mouseHandler),
  });
  if (isCurrentGraphNode(props)) {
    spanProps.class = 'element-selected';
  }
  else if (isSomeOccurenceOfCurrentGraphNode(props)) {
    spanProps.class = 'element-otherOccurence';
  }
  return h('span', spanProps, props.graphNode.getValue());
}

function mouseHandler(props: Props, event: MouseEvent) {
  const currentNode = props.current.saGraphView.currentNode;
  const alreadyIsCurrentNode = (currentNode && props.graphNode.equals(currentNode));
  if (!alreadyIsCurrentNode) {   
    props.changeCurrentNode(props.current.saGraphViewIndex, props.graphNode);
  }
  props.focusGraphView();
  // TODO proper mouse click handling
  props.showAlertModal(props.current.saGraphView.graphIndex, "Some message "+props.graphNode.toString()+".");
}