import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { DeleteGraphDialog } from '../../Dialogs/Dialog';
import { ButtonKeyEventOptions } from '../InputEventHandlers';
import { createFocusableElementProps } from '../FocusableElementProps';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { createFinishDialogAction } from 'UIStore/Dialogs';
import { setChangeFocusToGraphView } from 'UIStore/Focus';
import { deleteGraphByIndex } from 'UIStore/Graphs';

export function DeleteGraphDialogView(props: DialogProps<DeleteGraphDialog>) {
  return h('div', {}, [ 'Delete graph at index: ', props.dialog.graphToDeleteIndex, ' ',
    h('button', createFocusableElementProps(ButtonKeyEventOptions, props, {
      onclick: () => {
        props.dispatch(deleteGraphByIndex(props.dialog.graphToDeleteIndex));
        props.dispatch(createFinishDialogAction(props.dialogIndex));
        props.dispatch(setChangeFocusToGraphView());
      },
    }), 'Delete'),
    ' ', hc(DialogCancelButtonView, props) ]);
}