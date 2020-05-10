import { h, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { DeleteGraphDialog } from '../../Dialogs/Dialog';
import { ButtonKeyEventOptions } from '../InputEventHandlers';
import { createFocusableElementProps } from '../FocusableElementProps';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { createFinishDialogAction } from 'UIStore/Dialogs';
import { createSetChangeFocusToGraphViewAction } from 'UIStore/Focus';
import { createDeleteGraphAction } from 'UIStore/Graphs';

export function DeleteGraphDialogView(props: DialogProps<DeleteGraphDialog>) {
  return h('div', {}, [ 'Delete graph at index: ', props.dialog.graphToDeleteIndex, ' ',
    h('button', createFocusableElementProps(ButtonKeyEventOptions, props, {
      onclick: () => {
        props.dispatch(createDeleteGraphAction(props.dialog.graphToDeleteIndex));
        props.dispatch(createFinishDialogAction(props.dialogIndex));
        props.dispatch(createSetChangeFocusToGraphViewAction());
      },
    }), 'Delete'),
    ' ', hc(DialogCancelButtonView, props) ]);
}