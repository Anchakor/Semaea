import { h, hc } from '../../External';
import { DialogProps, DialogCancelButtonView } from '../DialogView';
import { DeleteGraphDialog } from '../../Dialogs/Dialog';
import { ButtonKeyEventOptions } from '../InputEventHandlers';
import { createFocusableElementProps } from '../FocusableElementProps';

export function DeleteGraphDialogView(props: DialogProps<DeleteGraphDialog>) {
  return h('div', {}, [ 'Delete graph at index: ', props.dialog.graphToDeleteIndex, ' ',
    h('button', createFocusableElementProps(ButtonKeyEventOptions, props, {
      onclick: () => {
        props.deleteGraph(props.dialog.graphToDeleteIndex);
        props.finishDialog(props.dialogIndex);
      },
    }), 'Delete'),
    ' ', hc(DialogCancelButtonView, props) ]);
}