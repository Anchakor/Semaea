import { QUnitStatic } from '../typings/qunit';
import * as Inferno from 'inferno';
import { default as InfernoHyperscript } from 'inferno-hyperscript';
import { default as InfernoComponent } from 'inferno-component';
import * as Redux from 'redux';
import * as InfernoRedux from 'inferno-redux';

export const $: any = (<any>window).$;
export const testlib: QUnitStatic = (<any>window).testlib;

export { Inferno as UILib };
export { InfernoComponent as Component };
export type VNode = Inferno.VNode;

export { InfernoHyperscript as h };
export const linkEvent = Inferno.linkEvent;

export { Redux as StoreLib };
export { InfernoRedux as UIStoreLib };