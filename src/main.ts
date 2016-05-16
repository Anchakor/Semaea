

declare var $: any;
declare var testlib: QUnitStatic;

var h = plastiq.html;
var bind = plastiq.bind;

function renderMain(model: Model) {
  model.refresh = plastiq.html.refresh;
  focusElemIdToFocus(model);
  
  return h('div',
    TripleView.render(model),
    Modals.render(model)
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