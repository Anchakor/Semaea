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
        onkeydown: controllerEventHandler(controllerKeydown, model, graphNode),
        onclick: controllerEventHandler(controllerClick, model, graphNode),
        onfocus: Utils.partial(GraphView.changeCurrentNode, model, graphNode)
      }, graphNode.getValue());
  }
  
  function controllerEventHandler (
      handler: ((model: Model, graphNode: GraphNode, e: Event) => any), 
      model: Model, 
      graphNode: GraphNode)
      {
      return function (e: Event, ...a) {
        if (Utils.partial(handler, model, graphNode).apply(this, arguments)) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      }
    }

  function controllerClick(model: Model, graphNode: GraphNode, e: MouseEvent) { 
    model.graph.replaceNode(graphNode, graphNode.getValue() + 'a');
    GraphView.changeCurrentNode(model, graphNode);
    return true;
  }

  function controllerKeydown(model: Model, graphNode: GraphNode, e: KeyboardEvent) {
    $('#t').textContent = e.keyCode + ' ' + e.key;
    if (Key.isM(e)) {
      keyPressedM(model);
    }
    if (Key.isN(e)) {
      Modals.Autocomplete.getGetStringAutocomplete(model, ['aaa', 'bbb', 'ccc']).then((value) => {
        window.alert('HOHOOO '+value);
      });
    }
    GraphView.changeCurrentNode(model, graphNode);
    return !(Key.isTab(e));
  }

  function keyPressedM(model: Model) {
    Modals.formGetString(model).then((value) => {
      window.alert('WOOOO '+value);
    });
    //model.modals.push(modalTest(model));
  }
}
