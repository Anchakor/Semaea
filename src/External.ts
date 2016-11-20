import { Plastiq, HtmlModule } from "../typings/plastiq.d";
import { QUnitStatic } from "../typings/qunit.d";
//import "../libraries/plastiq.js"

export const $: any = eval("$");
export const testlib: QUnitStatic = eval("testlib");
export const plastiq: Plastiq = eval("plastiq");

export const h: HtmlModule = eval("plastiq.html");
//export const bind = plastiq.bind;