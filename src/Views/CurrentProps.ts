import { SaView } from '../SaViews';
import { Dialog } from '../Dialogs/Dialog';
import { SaGraphView } from '../UIStore/Graphs';
import { StoreState } from '../UIStore/Main';
import { Graph } from '../Graphs/Graph';

export interface CurrentProps {
  saViewIndex: number
  saView: SaView
  saGraphViewIndex: number
  saGraphView: SaGraphView
  graph?: Graph
  dialogIndex?: number
  dialog?: Dialog
}

export function getCurrentProps(state: StoreState): CurrentProps {
  const currentProps: CurrentProps = {
    get saViewIndex() { return state.saViews_.currentSaViewIndex; },
    get saView() { return state.saViews_.saViews[this.saViewIndex]; },
    get saGraphViewIndex() { return this.saView.saGraphViewIndex; },
    get saGraphView() { return state.graphs_.saGraphViews[this.saGraphViewIndex]; },
    get graph() { return state.graphs_.graphs[this.saGraphView.graphIndex]; },
    get dialogIndex() {
      const dialogSaViewMappings = state.dialogs_.viewMappings;
      const matchingMappings = dialogSaViewMappings
        .filter((mapping, i, arr) => mapping.saViewIndex == this.saViewIndex);
      return (matchingMappings.length > 0) ? matchingMappings[0].dialogIndex : undefined;
    },
    get dialog() { return (this.dialogIndex != undefined) 
      ? state.dialogs_.dialogs[this.dialogIndex] : undefined; },
  }

  return currentProps;
}