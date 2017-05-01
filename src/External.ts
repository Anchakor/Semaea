import { QUnitStatic } from "qunit";
//import hs = require("../node_modules/inferno-hyperscript/dist/inferno-hyperscript");
import hs = require("inferno-hyperscript");
import Inferno = require("inferno");
//import InfernoComponent = require("../node_modules/inferno-component/dist/inferno-component");
//import InfernoComponent = require("inferno-component");
import InfernoComponent from "inferno-component";
//import InfernoComponent = require("../node_modules/inferno-component/dist/inferno-component");

export const $: any = (<any>window).$;
export const testlib: QUnitStatic = (<any>window).testlib;
export const inferno = Inferno;
export const Component = InfernoComponent;

//export const h = (_tag: any, _props: object = {}, _children: any[] | any = []) => hs(_tag, _props, _children);
export const h = (_tag: any, _props: object = {}, _children: any[] | any = []) => hs.default(_tag, _props, _children);
export const he = inferno.linkEvent;