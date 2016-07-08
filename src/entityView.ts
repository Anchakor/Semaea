namespace EntityView {
  export function render(model: Model, graphNode: GraphNode) {
    const style: any = {};
    if (model.meta.currentNode && model.meta.currentNode.getValue() == graphNode.getValue()) {
      style.color = '#4af';
    }
    if (model.meta.currentNode && model.meta.currentNode.toString() == graphNode.toString()) {
      style.color = '#5bf';
      style.fontWeight = 'bold';
    }
    return h('span', {
        style: style,
        tabIndex: 0,
        onkeydown: controllerEventHandler(controllerKeydown(model, graphNode)),
        onclick: controllerEventHandler(controllerClick(model, graphNode)),
        onfocus: GraphView.changeCurrentNodeCurry(model, graphNode)
      }, graphNode.getValue());
  }
  
  function controllerEventHandler(handler: (e: Event) => any) {
    return function (e: Event, ...a: any[]) {
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
    GraphView.changeCurrentNodeCurry(model, graphNode)();
    return true;
  }

  const controllerKeydown = (model: Model, graphNode: GraphNode) => (e: KeyboardEvent) => {
    $('#t').textContent = e.keyCode + ' ' + e.key;
    if (Key.isM(e)) {
      keyPressedM(model);
    }
    if (Key.isN(e)) {
      Modals.Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], 'test label').then((value) => {
        window.alert('HOHOOO '+value);
      });
    }
    if (Key.isEnter(e)) {
      Actions.showActionsMenuForGraphNode(model, graphNode);
    }
    GraphView.changeCurrentNodeCurry(model, graphNode)();
    return !(Key.isTab(e));
  }

  function keyPressedM(model: Model) {
    Modals.formGetString(model).then((value) => {
      window.alert('WOOOO '+value);
    });
    //model.modals.push(modalTest(model));
  }
}
