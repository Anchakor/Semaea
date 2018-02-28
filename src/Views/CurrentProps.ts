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
  const saViewIndex = state.saViews_.currentSaViewIndex;
  const saView = state.saViews_.saViews[saViewIndex];
  const saGraphViewIndex = saView.saGraphViewIndex;
  const saGraphView = state.graphs_.saGraphViews[saGraphViewIndex];
  const graph = state.graphs_.graphs[saGraphView.graphIndex];
  const dialogs = state.dialogs_.dialogs;
  const dialogSaViewMappings = state.dialogs_.viewMappings;
  const matchingMappings = dialogSaViewMappings.filter((mapping, i, arr) => mapping.saViewIndex == saViewIndex);
  const dialogIndex = (matchingMappings.length > 0) ? matchingMappings[0].dialogIndex : undefined;
  const dialog = dialogIndex ? state.dialogs_.dialogs[dialogIndex] : undefined;

  const currentProps: CurrentProps = {
    saViewIndex: saViewIndex,
    saView: saView,
    saGraphViewIndex: saGraphViewIndex,
    saGraphView: saGraphView,
    graph: graph,
    dialogIndex: dialogIndex,
    dialog: dialog
  }

  return currentProps;
}