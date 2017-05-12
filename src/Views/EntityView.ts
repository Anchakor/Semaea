import { h } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { GraphMeta } from '../UIStore/Graphs';
import * as GraphView from '../Views/GraphView';

interface Props extends GraphView.Props {
  graphNode: GraphNode
  graphMeta: GraphMeta
}

export function EntityView(props: Props) {
  let tagClass: string = '';
  if (props.graphMeta.currentNode && props.graphMeta.currentNode.getValue() == props.graphNode.getValue()) {
    tagClass = 'element-otherOccurence';
  }
  if (props.graphMeta.currentNode && props.graphMeta.currentNode.toString() == props.graphNode.toString()) {
    tagClass = 'element-selected';
  }
  return h('span', { 
    tabIndex: 0, 
    class: tagClass, 
    onclick: () => window.alert('asdf'),
    onfocus: () => props.changeCurrentNode(props.graphIndex, props.graphNode)
  }, props.graphNode.getValue());
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