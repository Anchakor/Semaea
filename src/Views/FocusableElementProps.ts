import { KeyEventOptions, getKeydownHandler, getKeyupHandler } from './InputEventHandlers';
import { DispatchProps } from '../UIStore/Main';
import { objectJoinExtend } from '../Common';
import { linkEvent } from '../External';

export function createFocusableElementProps<EP>(keyEventOptions: KeyEventOptions, props: DispatchProps, elementProps?: EP) {
  return objectJoinExtend({
    onkeyup: linkEvent(props, getKeyupHandler(props.dispatch, keyEventOptions)),
    onkeydown: linkEvent(props, getKeydownHandler(props.dispatch, keyEventOptions)),
  }, elementProps);
}