import { h, UIComponent, connect, StoreLib, hc } from '../../External';
import { DialogProps } from '../DialogView';
import { DialogCancelButtonView } from './DialogCancelButtonView';
import { AddTripleDialog } from '../../Dialogs/Dialog';
import { Triple } from '../../Graphs/Triple';
import { objectJoin } from '../../Common';
import { StoreState } from '../../UIStore/Main';
import { TextInputKeyEventOptions, ButtonKeyEventOptions } from '../InputEventHandlers';
import { createFocusableElementProps } from '../FocusableElementProps';

interface State {
  s: string
  p: string
  o: string
}

export class View extends UIComponent<DialogProps<AddTripleDialog>, State> {
  state: State = { s: "", p: "", o: "" };

  public constructor(props: DialogProps<AddTripleDialog>, context?: unknown) {
    super(props, context);
    if (!props) return;
    const t = props.dialog.triple;
    this.state = { s: t.s, p: t.p, o: t.o };
  }

  render() {
    return h('div', {}, [ 
      'Adding a triple: ', 
      h('input', createFocusableElementProps(TextInputKeyEventOptions, this.props, { 
        type: 'text', 
        value: this.state.s,
        onInput: (ev: Event) => this.setState({ s: (ev.target as HTMLInputElement).value } as State),
      })), ' ', 
      h('input', createFocusableElementProps(TextInputKeyEventOptions, this.props, { 
        type: 'text', 
        value: this.state.p,
        onInput: (ev: Event) => this.setState({ p: (ev.target as HTMLInputElement).value } as State),
      })), ' ', 
      h('input', createFocusableElementProps(TextInputKeyEventOptions, this.props, { 
        type: 'text', 
        value: this.state.o,
        onInput: (ev: Event) => this.setState({ o: (ev.target as HTMLInputElement).value } as State),
      })), ' ', 
      h('button', createFocusableElementProps(ButtonKeyEventOptions, this.props, {
        onclick: () => {
          this.props.addTriple(this.props.current.saGraphView.graphIndex, new Triple(this.state.s, this.state.p, this.state.o));
          this.props.finishDialog(this.props.dialogIndex);
        },
      }), 'Add'), ' ', 
      h('button', createFocusableElementProps(ButtonKeyEventOptions, this.props, {
        onclick: () => {
          this.props.addTriple(this.props.current.saGraphView.graphIndex, new Triple(this.state.s, this.state.p, this.state.o));
        },
      }), 'Add without closing'), ' ', 
      hc(DialogCancelButtonView, this.props) ]);
  }
}


// Component (container component):

export const Component = connect(
  View,
  (state: StoreState, ownProps?: DialogProps<AddTripleDialog>) => {
    return {};
  },
  (dispatch: <A extends StoreLib.Action>(action: A) => void) => { 
    return {};
  });