import { h, UIComponent } from "../../External";
import { DialogProps, getDialogCancelButton } from "../DialogView";
import { AddTripleDialog } from "../../Dialogs/Dialogs";
import { Triple } from "../../Graphs/Triple";
import { objectJoin } from "Common";

interface State {
  s: string
  p: string
  o: string
}

export class AddTripleDialogView extends UIComponent<DialogProps<AddTripleDialog>, State> {
  state: State

  constructor(props: DialogProps<AddTripleDialog>) {
    super(props);
    const t = props.dialog.triple;
    this.state = { s: t.s, p: t.p, o: t.o } as State;
  }

  render() {
    return h('div', {}, [ 
      'Adding a triple; ', 
      h('input', { type: 'text', 
        value: this.state.s,
        onInput: (ev: Event) => this.setState({ s: (ev.target as HTMLInputElement).value } as State)
      }),
      h('input', { type: 'text', 
        value: this.state.p,
        onInput: (ev: Event) => this.setState({ p: (ev.target as HTMLInputElement).value } as State)
      }),
      h('input', { type: 'text', 
        value: this.state.o,
        onInput: (ev: Event) => this.setState({ o: (ev.target as HTMLInputElement).value } as State)
      }),
      h('button', {
        onclick: () => alert('A triple was submitted: ' + new Triple(this.state.s, this.state.p, this.state.o).toString())
      }, 'Add'),
      ' ', getDialogCancelButton(this.props) ]);
  }
}
