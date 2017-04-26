import { Model } from "Model";
import { GraphNode } from "Graphs/GraphNode";
import { IString } from "Common";

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