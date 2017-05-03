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
export const connect = <P1, P2, C extends InfernoComponent<P1 & P2, {}>, OwnProps>(
  component: new () => C, 
  mapStateToProps?: (state: any, ownProps?: OwnProps) => P1, 
  mapDispatchToProps?: (dispatch: <A extends Redux.Action>(action: A) => void, ownProps?: OwnProps) => P2
  ) => InfernoRedux.connect(mapStateToProps, mapDispatchToProps)(component);
