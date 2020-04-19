import { h, UIComponent, hf, linkEvent, handleAsPure } from '../External';
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
import { thunkEntityMouseEvent } from '../UIStore/Graphs/SaGraphViews';

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
handleAsPure(entityView);

function mouseHandler(props: Props, event: MouseEvent) {
  props.dispatch(thunkEntityMouseEvent(event, props.graphNode));
}