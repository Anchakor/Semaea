import { h, UIComponent, connect, StoreLib, hc } from '../../External';
import { DialogProps, DialogCancelButtonView } from '../DialogView';
import { AddTripleDialog } from '../../Dialogs/Dialog';
import { Triple } from '../../Graphs/Triple';
import { objectJoin } from '../../Common';
import { StoreState } from '../../UIStore/Main';
import { keyup, KeyEventOptions, keydown, TextInputKeyEventOptions, ButtonKeyEventOptions } from '../InputEventHandlers';

interface State {
  s: string
  p: string
  o: string
}

export class View extends UIComponent<DialogProps<AddTripleDialog>, State> {
  state: State = { s: "", p: "", o: "" };

  public constructor(props?: DialogProps<AddTripleDialog>, context?: any) {
    super(props, context);
    if (!props) return;
    const t = props.dialog.triple;
    this.state = { s: t.s, p: t.p, o: t.o };
  }

  render() {
    return h('div', {}, [ 
      'Adding a triple: ', 
      h('input', { type: 'text', 
        value: this.state.s,
        onInput: (ev: Event) => this.setState({ s: (ev.target as HTMLInputElement).value } as State),
        onkeyup: keyup(this.props, TextInputKeyEventOptions),
        onkeydown: keydown(this.props, TextInputKeyEventOptions),
      }), ' ', 
      h('input', { type: 'text', 
        value: this.state.p,
        onInput: (ev: Event) => this.setState({ p: (ev.target as HTMLInputElement).value } as State),
        onkeyup: keyup(this.props, TextInputKeyEventOptions),
        onkeydown: keydown(this.props, TextInputKeyEventOptions),
      }), ' ', 
      h('input', { type: 'text', 
        value: this.state.o,
        onInput: (ev: Event) => this.setState({ o: (ev.target as HTMLInputElement).value } as State),
        onkeyup: keyup(this.props, TextInputKeyEventOptions),
        onkeydown: keydown(this.props, TextInputKeyEventOptions),
      }), ' ', 
      h('button', {
        onclick: () => {
          this.props.addTriple(this.props.current.saGraphView.graphIndex, new Triple(this.state.s, this.state.p, this.state.o));
          this.props.finishDialog(this.props.dialogIndex);
        },
        onkeyup: keyup(this.props, ButtonKeyEventOptions),
        onkeydown: keydown(this.props, ButtonKeyEventOptions),
      }, 'Add'), ' ', 
      h('button', {
        onclick: () => {
          this.props.addTriple(this.props.current.saGraphView.graphIndex, new Triple(this.state.s, this.state.p, this.state.o));
        },
        onkeyup: keyup(this.props, ButtonKeyEventOptions),
        onkeydown: keydown(this.props, ButtonKeyEventOptions),
      }, 'Add without closing'), ' ', 
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