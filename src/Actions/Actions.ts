import * as Modals from "Modals/Modals";
import * as Modals_Autocomplete from "Modals/Autocomplete";
import * as GraphViewMethods from "Views/GraphViewMethods";
import { Model } from "Model";
import { GraphNode } from "Graphs/GraphNode";
import { Triple } from "Graphs/Triple";
import { IString } from "Common";
import * as ServerClient from "Server/Client";

export interface ActionFunction {
  (model: Model, graphNode: GraphNode): void
}

export class Action implements IString {
  label: string = '';
  execute: ActionFunction;
  toString() { return this.label; }
}

export function showActionsMenuForGraphNode(model: Model, graphNode: GraphNode) {
  const actions: Action[] = [new AddTripleAction, new RemoveTripleAction, new CallServerAction];
  const label = 'Choose action for '+graphNode.getValue()+' ('+graphNode.getTriple().toString()+')';
  Modals_Autocomplete.showAutocompleteForm<Action>(model, actions, label, true).then((result) => {
    if (result.value) {
      result.value.execute(model, graphNode);
    }
  });
}

class CallServerAction extends Action {
  label = "Call server";
  execute = (model: Model, graphNode: GraphNode) => {
    const response = ServerClient.send(JSON.stringify({ command: "test command"}));
    response.then((value) => {
      window.alert("received server response: "+value);
    });
  }
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