import * as Modals from "../Modals/Modals";
import * as Modals_Autocomplete from "../Modals/Autocomplete";
import * as GraphViewMethods from "../GraphViewMethods";
import { Model } from "../Model";
import { GraphNode } from "../Graphs/GraphNode";
import { Triple } from "../Graphs/Triple";
import { IString } from "../Common";

export interface ActionFunction {
  (model: Model, graphNode: GraphNode): void
}

export class Action implements IString {
  label: string = '';
  execute: ActionFunction;
  toString() { return this.label; }
}

export function showActionsMenuForGraphNode(model: Model, graphNode: GraphNode) {
  const actions: Action[] = [new AddTripleAction, new RemoveTripleAction];
  const label = 'Choose action for '+graphNode.getValue()+' ('+graphNode.getTriple().toString()+')';
  Modals_Autocomplete.showAutocompleteForm<Action>(model, actions, label, false).then((result) => {
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
    Modals_Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], label)
    .then((result) => {
      predicate = result.text;
      const label = 'Choose object for '+graphNode.getValue();
      return Modals_Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], label); 
    }).then((result) => {
      const object = result.text;
      const triple = new Triple(graphNode.getValue(), predicate, object);
      model.graph.addTriple(triple);
      GraphViewMethods.changeCurrentNodeCurry(model, new GraphNode(triple, 'o'))();
    });
  }
}

class RemoveTripleAction extends Action {
  label = 'Remove the triple';
  execute = (model: Model, graphNode: GraphNode) => {
    model.graph.removeTriple(graphNode.getTriple());
  }
}