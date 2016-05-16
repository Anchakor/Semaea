class EntityController {
  static render(model: Model, graphNode: GraphNode) {
    var controllerEventHandler = function (handler, model: Model, graphNode: GraphNode) {
      return function (e) {
        if (Utils.partial(handler, model, graphNode).apply(this, arguments)) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      }
    }
    var style: any = {};
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
        onkeydown: controllerEventHandler(EntityController.controllerKeydown, model, graphNode),
        onclick: controllerEventHandler(EntityController.controllerClick, model, graphNode),
        onfocus: Utils.partial(GraphView.changeCurrentNode, model, graphNode)
      }, graphNode.getValue());
  }

  static controllerClick(model: Model, graphNode: GraphNode, e: MouseEvent) { 
    model.graph.replaceNode(graphNode, graphNode.getValue() + 'a');
    GraphView.changeCurrentNode(model, graphNode);
    return true;
  }

  static controllerKeydown(model: Model, graphNode: GraphNode, e: KeyboardEvent) {
    $('#t').textContent = e.keyCode + ' ' + e.key;
    if (e.keyCode == 77 /*m*/) {
      EntityController.keyPressedM(model);
    }
    GraphView.changeCurrentNode(model, graphNode);
    return !(e.keyCode == 9 /*tab*/);
  }

  static keyPressedM(model: Model) {
    Modals.formGetString(model).then(function (value) {
      window.alert('WOOOO '+value);
    });
    //model.modals.push(modalTest(model));
  }
}
