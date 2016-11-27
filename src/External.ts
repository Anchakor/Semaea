import { Plastiq, HtmlModule } from "plastiq";
import { QUnitStatic } from "qunit";
//import "../libraries/plastiq.js"

export const $: any = eval("$");
export const testlib: QUnitStatic = eval("testlib");
export const plastiq: Plastiq = eval("plastiq");

export const h: HtmlModule = eval("plastiq.html");
//export const bind = plastiq.bind;