namespace Actions {
  export interface ActionFunction {
    (model: Model, graphNode: GraphNode): void
  }

  export class Action implements IString {
    label: string = '';
    execute: ActionFunction;
    toString() { return this.label; }
  }

  export function showActionsMenuForGraphNode(model: Model, graphNode: GraphNode) {
    const actions: Action[] = [];
    const label = 'Choose action for '+graphNode.getValue()+' ('+graphNode.getTriple().toString()+')';
    Modals.Autocomplete.showAutocompleteForm(model, [new AddTripleAction], label, false).then((result) => {
      if (result.value != null) {
        result.value.execute(model, graphNode);
      }
    });
  }

  class AddTripleAction extends Action {
    label = 'Add triple';
    execute = (model: Model, graphNode: GraphNode) => {
      let predicate: string
      const label = 'Choose predicate for '+graphNode.getValue();
      Modals.Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], label)
      .then((result) => {
        predicate = result.text;
        const label = 'Choose object for '+graphNode.getValue();
        return Modals.Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], label); 
      }).then((result) => {
        const object = result.text;
        const triple = new Triple(graphNode.getValue(), predicate, object);
        model.graph.addTriple(triple);
        GraphView.changeCurrentNodeCurry(model, new GraphNode(triple, 'o'))();
      });
    }
  }


}