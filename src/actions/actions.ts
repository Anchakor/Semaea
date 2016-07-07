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
    const actions = [];
    Modals.Autocomplete.showAutocompleteForm(model, [new AddTripleAction], 'Choose action for '+graphNode.getValue()).then((value) => {
      value.execute(model, graphNode);
    });
  }

  class AddTripleAction extends Action {
    label = 'Add triple'
    execute = (model: Model, graphNode: GraphNode) => {
      Modals.Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], 'Choose predicate for '+graphNode.getValue()).then((value) => {
        const predicate = value;
        Modals.Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], 'Choose object for '+graphNode.getValue()).then((value) => {
          const triple = new Triple(graphNode.getValue(), predicate, value);
          model.graph.addTriple(triple);
        });
      });
    }
  }


}