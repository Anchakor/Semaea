import { KeyEventOptions, keyup, keydown, ButtonKeyEventOptions } from './InputEventHandlers';
import { MainDispatchProps } from './MainDispatchProps';
import { StoreState } from '../UIStore/Main';
import { CurrentProps } from 'Views/CurrentProps';
import { objectJoinExtend } from 'Common';

export function createFocusableElementProps(keyEventOptions: KeyEventOptions, props: MainDispatchProps & StoreState & { current: CurrentProps }, elementProps?: any) {
  return objectJoinExtend({
    onkeyup: keyup(props, keyEventOptions),
    onkeydown: keydown(props, keyEventOptions),
  }, elementProps);
}