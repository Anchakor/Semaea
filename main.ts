

declare var $: any;
declare var testlib: QUnitStatic;

var h = plastiq.html;
var bind = plastiq.bind;

function partial(fn, ...a) {
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);
  return function() {
    return fn.apply(this, args.concat(slice.call(arguments, 0)));
  };
}

function hashSetHasKey(hashSet, key) {
  return hashSet.hasOwnProperty(key);
}

function renderTriples(model: Model) {
  return renderLevel(model, 0);
}
function renderLevel(model: Model, depth) {
  return h('div', model.graph.get().map(function (triple: Triple) {
    return h('div',
      renderLevelPosition(model, new GraphNode(triple, 's')), ' ',
      renderLevelPosition(model, new GraphNode(triple, 'p')), ' ',
      renderLevelPosition(model, new GraphNode(triple, 'o'))
      );
  }));
}
function renderLevelPosition(model, graphNode) {
  return entityController(model, graphNode);   
}
function entityController(model: Model, graphNode: GraphNode) {
  var controllerEventHandler = function (handler, model: Model, graphNode: GraphNode) {
    return function (e) {
      if (partial(handler, model, graphNode).apply(this, arguments)) {
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
      onkeydown: controllerEventHandler(controllerKeydown, model, graphNode),
      onclick: controllerEventHandler(controllerClick, model, graphNode),
      onfocus: partial(refreshMeta, model, graphNode)
    }, graphNode.getValue());
}

function refreshMeta(model: Model, graphNode: GraphNode) {
  if (!graphNode) { return; }
  if (model.meta.currentNode) {
    if (model.meta.currentNode.getValue() != graphNode.getValue()) {
      model.meta.previousNode = model.meta.currentNode;
      if (model.meta.previousNode.position != 'p') {
        model.meta.previousNodeNonPredicate = model.meta.previousNode
      } else {
        model.meta.previousNodePredicate = model.meta.previousNode
      }
    }
  }
  model.meta.currentNode = graphNode;
}

function controllerClick(model: Model, graphNode: GraphNode, e: MouseEvent) { 
  model.graph.replaceNode(graphNode, graphNode.getValue() + 'a');
  refreshMeta(model, graphNode);
  return true;
}

function formGetString(model: Model) {
  var pastFocus = document.activeElement;
  var p = new Promise<string>(function (resolve, reject) {
    var position = model.modals.length;
    var form = h('div', 
      h('input', {
        type: 'text', id: 'modal'+position,
        onkeydown: function (e: KeyboardEvent) {
          if (e.keyCode == 13 /*enter*/) {
            closeModal(model, form);
            (<HTMLElement>pastFocus).focus();
            resolve((<HTMLInputElement>e.target).value)
            return false;
          }
          return true;
        }
      })
    );
    model.modals.push(form);
    model.elemIdToFocus = 'modal'+position;
  }); 
  //plastiq.html.refreshAfter(p);
  return p;
}

function closeModal(model: Model, modal) {
  model.modals = (model.modals).filter(function (val, ix) {
      return val != modal;
    });
  model.refresh();
}

function modalTest(model: Model) {
  return h('div', 'asdasd');
}

function keyPressedM(model: Model) {
  formGetString(model).then(function (value) {
    window.alert('WOOOO '+value);
  });
  //model.modals.push(modalTest(model));
}

function controllerKeydown(model: Model, graphNode: GraphNode, e: KeyboardEvent) {
  $('#t').textContent = e.keyCode + ' ' + e.key;
  if (e.keyCode == 77 /*m*/) {
    keyPressedM(model);
  }
  refreshMeta(model, graphNode);
  return !(e.keyCode == 9 /*tab*/);
}

function renderLevelPositionSimple(entity, componentContainerDict) {
  return h('div', entity);
}

function renderModals(model: Model) {
  return h('div', {
      class: "modals"
    }, model.modals.map(function (modal, i, a) {
      return h('div', {
        class: "modal" + ((i + 1 == a.length) ? " modal-top" : "")
      }, modal);
    }),
    h('div', {
      class: (model.modals.length > 0) ? "modalBackground" : ""
    }));
}

function renderMain(model: Model) {
  model.refresh = plastiq.html.refresh;
  focusElemIdToFocus(model);
  
  return h('div',
    renderTriples(model),
    renderModals(model)
    );
}

function focusElemIdToFocus(model: Model) {
  setTimeout(function () {
    if (model.elemIdToFocus != null && model.elemIdToFocus != '') {
      var elem = $('#'+model.elemIdToFocus)
      if (elem != null) { elem.focus(); }
    }
  }, 0);
}

var graph = new Graph();
graph.addTriple(new Triple("testS", "testP", "testO"));
graph.addTriple(new Triple("testS", "testP2", "testO"));
graph.addTriple(new Triple("testO", "testP3", "testO3"));

interface Model {
  refresh: () => void
  elemIdToFocus: string
  graph: Graph
  meta: any
  modals: Array<any>
}

window.onload = function () {
  var model0: Model = { refresh: null,
    elemIdToFocus: null,
    graph: graph, 
    meta: { currentNode: null, previousNode: null, 
      previousNodeNonPredicate: null, previousNodePredicate: null },
    modals: [] };
  plastiq.append($('#plastiq'), function (model: Model) { return renderMain(model); }, model0);

  setInterval(function() { $('#graph').textContent = JSON.stringify(model0); }, 1000);
};