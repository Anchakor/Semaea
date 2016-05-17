

declare const $: any;
declare const testlib: QUnitStatic;

const h = plastiq.html;
const bind = plastiq.bind;

function renderMain(model: Model) {
  model.refresh = plastiq.html.refresh;
  focusElemIdToFocus(model);
  
  return h('div',
    TripleView.render(model),
    Modals.render(model)
    );
}

function focusElemIdToFocus(model: Model) {
  setTimeout(() => {
    if (model.elemIdToFocus != null && model.elemIdToFocus != '') {
      const elem = $('#'+model.elemIdToFocus)
      if (elem != null) { elem.focus(); }
    }
  }, 0);
}

const graph = new Graph();
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
  const model0: Model = { refresh: null,
    elemIdToFocus: null,
    graph: graph, 
    meta: { currentNode: null, previousNode: null, 
      previousNodeNonPredicate: null, previousNodePredicate: null },
    modals: [] };
  plastiq.append($('#plastiq'), (model: Model) => { return renderMain(model); }, model0);

  setInterval(() => { $('#graph').textContent = JSON.stringify(model0); }, 1000);
};