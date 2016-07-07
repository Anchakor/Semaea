namespace Actions {
  export interface ActionFunction {
    (model: Model, graphNode: GraphNode): void
  }

  export class Action {
    label: string = '';
    execute: ActionFunction;
  }

  export function showActionsMenuForGraphNode(model: Model, graphNode: GraphNode) {
    Modals.Autocomplete.getGetStringAutocomplete(model, ['aaa', 'bbb', 'ccc'], 'Choose action for '+graphNode.getValue()).then((value) => {
      window.alert('HOHOOO '+value);
    });
  }


}