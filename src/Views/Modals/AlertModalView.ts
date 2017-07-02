import { ModalPropsBase } from "../../Views/ModalsView";
import { h } from "../../External";
import * as Modals from '../../UIStore/Modals';

export interface xProps extends ModalPropsBase {
  modal: Modals.AlertModal
}

export function AlertModalView(props: xProps) {
  return h('span', {}, props.modal.message)
}