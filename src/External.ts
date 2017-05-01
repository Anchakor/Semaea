import { QUnitStatic } from '../typings/qunit';
import Inferno = require('inferno');
import hs = require('inferno-hyperscript');
import InfernoComponent = require('inferno-component');

export const $: any = (<any>window).$;
export const testlib: QUnitStatic = (<any>window).testlib;
export const inferno = Inferno;
export const Component = InfernoComponent.default;
export type VNode = Inferno.VNode;

export const h = (_tag: any, _props: object = {}, _children: any[] | any = []) => hs.default(_tag, _props, _children);
export const linkEvent = inferno.linkEvent;