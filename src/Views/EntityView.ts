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
import { dialogEntityMouseClickHandler } from './Dialogs/DialogEventHandlers';

interface Props extends GraphView.Props {
  graphNode: GraphNode,
  isCurrentNode: boolean,
  isOccurenceOfCurrentNode: boolean
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
    oncontextmenu: linkEvent(props, mouseHandler),
  });
  if (props.isCurrentNode) {
    spanProps.class = 'element-selected';
  }
  else if (props.isOccurenceOfCurrentNode) {
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

  if (dialogEntityMouseClickHandler(props, event, props.graphNode)) return;

  if (event.button == 2) {
    props.createDialogMenuDialog(props.current.saViewIndex);
    event.preventDefault();
    return;
  }

  if (alreadyIsCurrentNode) {
    props.showAlertModal(props.current.saGraphView.graphIndex, "Some message "+props.graphNode.toString()+".");
  }
}