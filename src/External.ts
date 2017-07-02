import { QUnitStatic } from '../typings/qunit';
import * as Inferno from 'inferno';
import { default as InfernoHyperscript } from 'inferno-hyperscript';
import { default as InfernoComponent } from 'inferno-component';
import * as Redux from 'redux';
import * as InfernoRedux from 'inferno-redux';

export const $: any = (<any>window).$;
export const testlib: QUnitStatic = (<any>window).testlib;

export { Inferno as UILib };
export { InfernoComponent as UIComponent };
export type VNode = Inferno.VNode;

export { InfernoHyperscript as h };
export const linkEvent = Inferno.linkEvent;

export { Redux as StoreLib };
export { InfernoRedux as UIStoreLib };

/** Connect UIComponent to UIStore.
 * `component` has props made by 
 * 1) `mapStateToProps` (usually use `objectJoin` on the entire `state` plus object of select relevant properties deeper in the state)
 * 2) `mapDispatchToProps` (create props trigger functions actions using `dispatch`)
 * @param component The components (extends UIComponent). 
 *    Has props object of union of output of `mapStateToProps` and `mapDispatchToProps`.
 * @param mapStateToProps Maps state into props for `component` (usually use `objectJoin` on the entire `state` plus object of select relevant properties deeper in the state).
 * @param mapDispatchToProps Create props trigger functions actions using `dispatch` function.
 */
export const connect = <P1, P2, C extends InfernoComponent<P1 & P2, {}>, OwnProps>(
  component: new () => C, 
  mapStateToProps?: (state: any, ownProps?: OwnProps) => P1, 
  mapDispatchToProps?: (dispatch: <A extends Redux.Action>(action: A) => void, ownProps?: OwnProps) => P2
  ) => InfernoRedux.connect(mapStateToProps, mapDispatchToProps)(component);
