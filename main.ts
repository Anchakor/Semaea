

declare var $: any;

var h = plastiq.html;
var bind = plastiq.bind;
var refresh = plastiq.html.refresh;

function partial(fn, ...a) {
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);
  return function() {
    return fn.apply(this, args.concat(slice.call(arguments, 0)));
  };
}

//function newCC(component) {
//	var componentContainer = { _instances: new Array() };
//	componentContainer._function = partial(component, componentContainer._instances);
//	return componentContainer;
//}

//function useCC(componentContainer) {
//	var component = h.component(componentContainer._function);
//	componentContainer._instances.push(component);
//	return component;
//}

//function democomp(instances, model) {
//	return h('button', {onclick: function () { 
//				model.counter++;
//				return instances; 
//			}}, 'refresh components');
//}


function hashSetHasKey(hashSet, key) {
  return hashSet.hasOwnProperty(key);
}

function renderTriples(model) {
  return renderLevel(model, 0);
}
function renderLevel(model, depth) {

  return h('div', model.graph._graph.map(function (triple) {
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
function entityController(model, graphNode) {
  var controllerEventHandler = function (handler, model, graphNode) {
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

function refreshMeta(model, graphNode) {
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

function controllerClick(model, graphNode, e) { 
  model.graph.replaceNode(graphNode, graphNode.getValue() + 'a');
  refreshMeta(model, graphNode);
  return true;
}

function controllerKeydown(model, graphNode, e) {
  $('#t').textContent = e.keyCode + ' ' + e.key;
  if (e.keyCode == 77 /*m*/) {
    model.modals.push("m");
  }
  refreshMeta(model, graphNode);
  return !(e.keyCode == 9);
}

function renderLevelPositionSimple(entity, componentContainerDict) {
  return h('div', entity);
}

function renderModals(model) {
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

function renderMain(model) {
  return h('div',
    renderTriples(model),
    renderModals(model)
    );
}

var graph = new Graph();
graph.addTriple(new Triple("testS", "testP", "testO"));
graph.addTriple(new Triple("testS", "testP2", "testO"));
graph.addTriple(new Triple("testO", "testP3", "testO3"));

window.onload = function () {
  var model0 = { graph: graph, 
    meta: { currentNode: null, previousNode: null, 
      previousNodeNonPredicate: null, previousNodePredicate: null },
    modals: [] };
  plastiq.append($('#plastiq'), function (model) { return renderMain(model); }, model0);

  setInterval(function() { $('#graph').textContent = JSON.stringify(model0); }, 1000);
};