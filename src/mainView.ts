namespace MainView {
  export function render(model: Model) {
    model.refresh = plastiq.html.refresh;
    focusElemIdToFocus(model);
    
    return h('div',
      GraphView.render(model),
      ModalsView.render(model)
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
}