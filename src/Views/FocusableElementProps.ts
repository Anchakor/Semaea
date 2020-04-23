import { KeyEventOptions, getKeydownHandler, getKeyupHandler } from './InputEventHandlers';
import { DispatchProps } from '../UIStore/Main';
import { objectJoinExtend } from '../Common';
import { linkEvent } from '../External';

export function createFocusableElementProps(keyEventOptions: KeyEventOptions, props: DispatchProps, elementProps?: any) {
  return objectJoinExtend({
    onkeyup: linkEvent(props, getKeyupHandler(props.dispatch, keyEventOptions)),
    onkeydown: linkEvent(props, getKeydownHandler(props.dispatch, keyEventOptions)),
  }, elementProps);
}