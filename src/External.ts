import { QUnitStatic } from '../typings/qunit';
import * as Inferno from 'inferno';
import { h as InfernoHyperscript } from 'inferno-hyperscript';
import { Component as InfernoComponent } from 'inferno';
import * as Redux from 'redux';
import * as InfernoRedux from 'inferno-redux';

export const $: (selector: string) => HTMLElement = (<any>window).$;
export const testlib: QUnitStatic = (<any>window).testlib;

const textDecoder = new TextDecoder('utf-8');
const textEncoder = new TextEncoder();
export const ArrayBufferTools = {
  getArrayBuffer: (array: Uint8Array) => array.buffer.slice(array.byteOffset, array.byteOffset+array.byteLength),
  fromString: (x: string) => textEncoder.encode(x).buffer,
  fromStringToUint8: (x: string) => textEncoder.encode(x),
  toString: (array: Uint8Array | ArrayBuffer) => textDecoder.decode(array),
};

export { Inferno as UILib };
export { InfernoComponent as UIComponent };
export type VNode = Inferno.VNode;

//export { InfernoHyperscript as h };
export const linkEvent = Inferno.linkEvent;
export type InfernoChildren = string|number|VNode|Array<string|number|VNode>;
export function h(_tag: string | VNode | (() => VNode), _props?: any, _children?: InfernoChildren): VNode {
  return InfernoHyperscript(_tag, _props, _children);
}
export type FunctionalUIComponent<P> = (props: P) => VNode;
export function hf<P>(_tag: FunctionalUIComponent<P>, _props: P, _children?: InfernoChildren): VNode {
  return InfernoHyperscript(_tag, _props, _children);
}
export function hc<P,S>(_tag: (new (p: P, context?: any) => InfernoComponent<P, S>), _props?: Partial<P>, _children?: InfernoChildren): VNode {
  return InfernoHyperscript(_tag, _props, _children);
}

export function handleAsPure<P>(f: FunctionalUIComponent<P>) {
  (f as any).defaultHooks = {
    onComponentShouldUpdate(lastProps: P, nextProps: P) {
        return nextProps != lastProps;
    }
  }
}

export { Redux as StoreLib };
export { InfernoRedux as UIStoreLib };

export type Reducer<S> = (state: S, action: Redux.Action) => S

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
