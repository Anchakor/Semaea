import { KeyEventOptions, getKeydownHandler, ButtonKeyEventOptions, getKeyupHandler } from './InputEventHandlers';
import { MainDispatchProps } from './MainDispatchProps';
import { StoreState } from '../UIStore/Main';
import { CurrentProps } from 'Views/CurrentProps';
import { objectJoinExtend } from 'Common';
import { linkEvent } from 'External';

export function createFocusableElementProps(keyEventOptions: KeyEventOptions, props: MainDispatchProps & StoreState & { current: CurrentProps }, elementProps?: any) {
  return objectJoinExtend({
    onkeyup: linkEvent(props, getKeyupHandler(keyEventOptions)),
    onkeydown: linkEvent(props, getKeydownHandler(keyEventOptions)),
  }, elementProps);
}