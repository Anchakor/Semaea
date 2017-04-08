import { h, $ } from "External";
import * as GraphViewMethods from "GraphViewMethods";
import * as Modals_Autocomplete from "Modals/Autocomplete";
import * as Modals from "Modals/Modals";
import * as Actions from "Actions/Actions";
import { Model } from "Model";
import { GraphNode } from "Graphs/GraphNode";
import * as Key from "Key";

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
      onkeydown: controllerEventHandler(controllerKeydown(model, graphNode)),
      onclick: controllerEventHandler(controllerClick(model, graphNode)),
      onfocus: GraphViewMethods.changeCurrentNodeCurry(model, graphNode)
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
