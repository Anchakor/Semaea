import { ModalPropsBase } from "../../Views/ModalsView";
import { h } from "../../External";
import * as Modals from '../../UIStore/Modals';

interface Props extends ModalPropsBase {
  modal: Modals.AlertModal
}

export function AlertModalView(props: Props) {
  return h('span', {}, props.modal.message)
}