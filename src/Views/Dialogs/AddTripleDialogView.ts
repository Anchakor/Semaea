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
    this.state = { s: t.s, p: t.p, o: t.o };
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
        onclick: () => {
          this.props.addTriple(this.props.graphIndex, new Triple(this.state.s, this.state.p, this.state.o));
          this.props.finishDialog(this.props.dialogIndex);
        }
      }, 'Add'),
      ' ', getDialogCancelButton(this.props) ]);
  }
}