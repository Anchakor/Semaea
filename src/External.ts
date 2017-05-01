import { Plastiq, HtmlModule } from 'plastiq';
import { QUnitStatic } from 'qunit';
//import '../libraries/plastiq.js'

export const $: any = (<any>window).$;
export const testlib: QUnitStatic = (<any>window).testlib;
export const plastiq: Plastiq = (<any>window).plastiq;

export const h: HtmlModule = (<any>window).plastiq.html;
//export const bind = plastiq.bind;