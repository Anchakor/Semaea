//import { Plastiq, HtmlModule } from "plastiq";
import { QUnitStatic } from "qunit";
import hs = require("../node_modules/inferno-hyperscript/dist/inferno-hyperscript");
import Inferno = require("inferno");
//import "../libraries/plastiq.js"

export const $: any = (<any>window).$;
export const testlib: QUnitStatic = (<any>window).testlib;
export const inferno = Inferno;

export const h = (_tag: any, _props: object = {}, _children: any[] | any = []) => hs(_tag, _props, _children);
//export const bind = plastiq.bind;