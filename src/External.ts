import { QUnitStatic } from '../typings/qunit';
import * as Inferno from 'inferno';
import { default as InfernoHyperscript } from 'inferno-hyperscript';
import { default as InfernoComponent,  } from 'inferno-component';

export const $: any = (<any>window).$;
export const testlib: QUnitStatic = (<any>window).testlib;
export const UILib = Inferno;
export const Component = InfernoComponent;
export type VNode = Inferno.VNode;

export const h = InfernoHyperscript;
export const linkEvent = UILib.linkEvent;