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

//export { InfernoHyperscript as h };
export const linkEvent = Inferno.linkEvent;
export function h(_tag: string | VNode | (() => VNode), _props?: any, _children?: Inferno.InfernoChildren): VNode {
  return InfernoHyperscript(_tag, _props, _children);
}
export function hf<P>(_tag: (props: P) => VNode, _props: P, _children?: Inferno.InfernoChildren): VNode {
  return InfernoHyperscript(_tag, _props, _children);
}
export function hc<P,S>(_tag: (new (p: P, context?: any) => InfernoComponent<P, S>), _props?: Partial<P>, _children?: Inferno.InfernoChildren): VNode {
  return InfernoHyperscript(_tag, _props, _children);
}


export { Redux as StoreLib };
export { InfernoRedux as UIStoreLib };

/** Connect UIComponent to UIStore.
 * `component` has props made by 
 * 1) `mapStateToProps` (usually use `objectJoin` on the entire UIStore `state` plus object of select relevant properties deeper in the state)
 * 2) `mapDispatchToProps` (create props trigger functions actions using `dispatch`)
 * `ownProps` are props passed to the component on call
 * @param component The components (extends UIComponent). 
 *    Has props object of union of output of `mapStateToProps` and `mapDispatchToProps`.
 * @param mapStateToProps Maps state into props for `component` (usually use `objectJoin` on the entire `state` plus object of select relevant properties deeper in the state).
 * @param mapDispatchToProps Create props trigger functions actions using `dispatch` function.
 */
export const connect = <OwnProps, StateProps, DispatchProps, State, Component extends InfernoComponent<OwnProps & StateProps & DispatchProps, State> >(
  component: new (props: OwnProps & StateProps & DispatchProps, context?: any) => Component, 
  mapStateToProps?: (state: any, ownProps: OwnProps) => StateProps, 
  mapDispatchToProps?: (dispatch: <A extends Redux.Action>(action: A) => void, ownProps: OwnProps) => DispatchProps
  ) => InfernoRedux.connect(mapStateToProps, mapDispatchToProps)(component);
