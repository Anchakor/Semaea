import * as Modals from "Modals/Modals";
import * as Autocomplete from "Modals/Autocomplete";
import * as GraphViewMethods from "Views/GraphViewMethods";
import { Model } from "Model";
import { GraphNode } from "Graphs/GraphNode";
import { Triple } from "Graphs/Triple";
import { IString } from "Common";
import * as ServerClient from "Server/Client";
import * as Request from "Server/Request";

export interface IActionFunction {
  (model: Model, graphNode: GraphNode): void
}

export interface IAction extends IString {
  label: string
  execute: IActionFunction
  toString(): string
}

export abstract class Action implements IAction {
  abstract label: string;
  abstract execute: IActionFunction;
  toString() { return this.label; }
}

export function showActionsMenuForGraphNode(model: Model, graphNode: GraphNode) {
  const actions: Action[] = [new AddTripleAction, new RemoveTripleAction, new CallServerAction];
  const label = 'Choose action for '+graphNode.getValue()+' ('+graphNode.getTriple().toString()+')';
  showActionsMenu(model, graphNode, actions, label);
}

export function showActionsMenu(model: Model, graphNode: GraphNode, actions: IAction[], label: string) {
  Autocomplete.showAutocompleteForm(model, actions, label, true).then((result) => {
    if (result.value) {
      result.value.execute(model, graphNode);
    }
  });
}

class CallServerAction extends Action {
  label = "Call server";
  execute = (model: Model, graphNode: GraphNode) => {
    const c = new Request.ListDirectoryRequest();
    { c.dirPath = "test"; }
    ServerClient.send(c)
    .then((response) => {
      window.alert("received server response: "+response);
    });
  }
}

class AddTripleAction extends Action {
  label = 'Add triple';
  execute = (model: Model, graphNode: GraphNode) => {
    let predicate: string
    const label = 'Choose predicate for '+graphNode.getValue();
    Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], label)
    .then((result) => {
      predicate = result.text;
      const label = 'Choose object for '+graphNode.getValue();
      return Autocomplete.showAutocompleteForm(model, ['aaa', 'bbb', 'ccc'], label); 
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