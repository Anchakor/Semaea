import { h, linkEvent, handleAsPure } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { thunkEntityMouseEvent } from '../UIStore/Graphs/SaGraphViews';
import { DispatchProps } from '../UIStore/Main';

interface Props extends DispatchProps {
  graphNode: GraphNode,
  isCurrentNode: boolean,
  isOccurenceOfCurrentNode: boolean
}

export function entityView(props: Props) {
  let spanProps = { 
    class: '',
    onclick: linkEvent(props, mouseHandler),
    oncontextmenu: linkEvent(props, mouseHandler),
  };
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