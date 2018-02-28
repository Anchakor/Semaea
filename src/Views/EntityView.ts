import { h, UIComponent, hf } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { SaGraphView } from '../UIStore/Graphs';
import * as GraphView from '../Views/GraphView';
import * as Key from '../Key';
import { objectJoinExtend } from '../Common';
import { getDialogMappingsToSaView, shouldDialogBeVisible } from '../Dialogs/Dialog';
import { FocusTargetAreas } from '../UIStore/Focus';

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
    onkeyup: keyup(props),
    onkeydown: keydown(props),
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

function keyup(props: Props) {
  return (event: KeyboardEvent) => {
    // TODO dialog/graph keydown handling
    if (Key.isSpacebar(event)) {
      props.createDialogMenuDialog(props.current.saViewIndex);
      event.preventDefault();
    } else if (Key.isEscape(event)) {
      cancelLinkedDialogs(props);
    } else if (Key.isDownArrow(event)) {
      props.changeCurrentGraphNodeByOffset(props.current.saGraphViewIndex, 1);
      event.preventDefault();
    } else if (Key.isUpArrow(event)) {
      props.changeCurrentGraphNodeByOffset(props.current.saGraphViewIndex, -1);
      event.preventDefault();
    } else if (Key.isM(event)) {
      props.createDeleteGraphDialog(props.current.saGraphView.graphIndex, props.current.saViewIndex);
    } else if (Key.isN(event)) {
      props.createAddTripleDialog(props.graphNode, props.current.saViewIndex);
    }
  }
}
function keydown(props: Props) {
  return (event: KeyboardEvent) => {
    if (Key.isSpacebar(event)
      || Key.isDownArrow(event)
      || Key.isUpArrow(event)) {
      event.preventDefault();
    }
  }
}

function cancelLinkedDialogs(props: Props) {
  const linkedDialogs = getDialogMappingsToSaView(props.current.saViewIndex, props.dialogs_.viewMappings);
  if (linkedDialogs.length == 0) return;
  linkedDialogs.every((v, i, a) => {
    const dialog = props.dialogs_.dialogs[v.dialogIndex];
    if (!dialog || !shouldDialogBeVisible(dialog)) return true;
    props.cancelDialog(v.dialogIndex); return true;
  });
}

/*
export function render(model: Model, graphNode: GraphNode) {
  let tagClass: string = '';
  if (model.meta.currentNode && model.meta.currentNode.getValue() == graphNode.getValue()) {
    tagClass = 'element-otherOccurence';
  }
  if (model.meta.currentNode && model.meta.currentNode.toString() == graphNode.toString()) {
    tagClass = 'element-selected';
  }
  return h('span', {
      class: tagClass,
      tabIndex: 0,
      onkeydown: linkEvent(model, controllerEventHandler(controllerKeydown(model, graphNode))),
      onclick: linkEvent(model, controllerEventHandler(controllerClick(model, graphNode))),
      onfocus: linkEvent(model, GraphViewMethods.changeCurrentNodeCurry(model, graphNode))
    }, graphNode.getValue());
}

function controllerEventHandler(handler: (e: Event) => any) {
  return function (this: (e: Event) => any, e: Event, ...a: any[]) {
    if (handler.apply(this, arguments)) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  }
}

const controllerClick = (model: Model, graphNode: GraphNode) => (e: MouseEvent) => { 
  model.graph.replaceNode(graphNode, graphNode.getValue() + 'a');
  GraphViewMethods.changeCurrentNodeCurry(model, graphNode)();
  return true;
}

const controllerKeydown = (model: Model, graphNode: GraphNode) => (e: KeyboardEvent) => {
  $('#t').textContent = e.keyCode + ' ' + e.key;
  if (Key.isM(e)) {
    keyPressedM(model);
  }
  if (Key.isN(e)) {
    Modals_Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], 'test label').then((value) => {
      window.alert('HOHOOO '+value);
    });
  }
  if (Key.isEnter(e)) {
    Actions.showActionsMenuForGraphNode(model, graphNode);
  }
  GraphViewMethods.changeCurrentNodeCurry(model, graphNode)();
  return !(Key.isTab(e));
}

function keyPressedM(model: Model) {
  Modals.formGetString(model).then((value) => {
    window.alert('WOOOO '+value);
  });
  //model.modals.push(modalTest(model));
}
*/