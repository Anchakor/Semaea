import { h } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { SaGraphView } from '../UIStore/Graphs';
import * as GraphView from '../Views/GraphView';
import * as Key from '../Key';

interface Props extends GraphView.Props {
  graphNode: GraphNode
  saGraphView: SaGraphView
}

export function EntityView(props: Props) {
  let tagClass: string = '';
  if (props.saGraphView.currentNode && props.saGraphView.currentNode.getValue() == props.graphNode.getValue()) {
    tagClass = 'element-otherOccurence';
  }
  if (props.saGraphView.currentNode && props.saGraphView.currentNode.toString() == props.graphNode.toString()) {
    tagClass = 'element-selected';
  }
  return h('span', { 
    tabIndex: 0, 
    class: tagClass, 
    onkeydown: keydown(props),
    onclick: () => props.showAlertModal(props.saGraphView.graphIndex, "Some message "+props.graphNode.toString()+"."),
    onfocus: () => props.changeCurrentNode(props.saView.saGraphViewIndex, props.graphNode)
  }, props.graphNode.getValue());
}

function keydown(props: Props) {
  return (event: KeyboardEvent) => {
    if (Key.isM(event)) {
      props.createDeleteGraphDialog(123, props.saViewIndex);
    } else if (Key.isN(event)) {
      props.createAddTripleDialog(props.graphNode, props.saViewIndex);
    }
  }
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