import { ModalProp } from "../../Views/ModalsView";
import { h } from "../../External";
import * as Modals from '../../UIStore/Modals';

export function AlertModalView(props: ModalProp<Modals.AlertModal>) {
  return h('span', {}, props.modal.message)
}