import { objectJoin, objectJoinExtend } from '../Common';
import { connect, h, StoreLib, UIComponent } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { createChangeCurrentNodeAction, SaGraphView, createChangeSaGraphViewGraphAction } from '../UIStore/Graphs';
import { StoreState } from '../UIStore/Main';
import * as EntityView from '../Views/EntityView';
import { createShowAlertModalAction } from '../UIStore/Modals';
import { createChangeSaViewSaGraphViewAction } from '../UIStore/SaViews';
import { Graph } from '../Graphs/Graph';
import { createCreateDeleteGraphDialogAction, createCreateAddTripleDialogAction } from '../UIStore/Dialogs/BasicGraphDialogs';
import { SaView } from '../SaViews';
import { createCreateDialogMenuDialogAction } from 'UIStore/Dialogs/DialogMenuDialog';

// View (component):

export interface StateProps extends StoreState {
  saViewIndex: number
  saView: SaView
  saGraphView: SaGraphView
  graph: Graph
}
export interface DispatchProps {
  changeCurrentGraph: (saGraphViewIndex: number, graphIndex: number) => void
  changeCurrentSaGraphView: (saViewIndex: number, saGraphViewIndex: number) => void
  changeCurrentNode: (saGraphViewIndex: number, graphNode: GraphNode) => void
  showAlertModal: (originatingGraphIndex: number, message: string) => void
  createDialogMenuDialog: (originatingSaViewIndex: number) => void
  createDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => void
  createAddTripleDialog: (graphNode: GraphNode, originatingSaViewIndex: number) => void
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    return h('div', {}, [
      this.renderSaGraphViewSwitchingBar(),
      this.renderGraphSwitchingBar(),
      h('hr'),
      this.renderCurrentGraph()
    ]);
  }

  private renderSaGraphViewSwitchingBar() {
    return h('div', {}, [
      h('span', {}, "Graph Views: ")
    ].concat(this.props.graphs_.saGraphViews.map((g, i) => {
      let tagClass: string = '';
      if (this.props.saView.saGraphViewIndex == i) {
        tagClass = 'element-selected'
      }
      return h('button', { 
        class: tagClass,
        onclick: () => this.props.changeCurrentSaGraphView(this.props.saViewIndex, i)
      }, i.toString())
    })));
  }

  private renderGraphSwitchingBar() {
    return h('div', {}, [
      h('span', {}, "Graphs: ")
    ].concat(this.props.graphs_.graphs.map((graph, graphIndex) => graphIndex)
      // Don't show deleted graphs (undefined)
      .filter((graphIndex) => this.props.graphs_.graphs[graphIndex])
      .map((graphIndex) => {
      let tagClass: string = '';
      if (this.props.saGraphView.graphIndex == graphIndex) {
        tagClass = 'element-selected'
      }
      return h('button', { 
        class: tagClass,
        onclick: () => this.props.changeCurrentGraph(this.props.saView.saGraphViewIndex, graphIndex)
      }, graphIndex.toString())
    })));
  }

  private renderCurrentGraph() {
    if (!this.props.graph) {
      return h('div', {}, 'Viewed graph is undefined');
    }
    return h('div', {}, this.props.graph.get().map((triple: Triple) => {
      return h('div', {}, [
        renderLevelPosition(this.props, new GraphNode(triple, 's')), ' ',
        renderLevelPosition(this.props, new GraphNode(triple, 'p')), ' ',
        renderLevelPosition(this.props, new GraphNode(triple, 'o'))
        ]);
    }));
  }
}

function renderLevelPosition(props: Props, graphNode: GraphNode) {
  return h(EntityView.EntityView, objectJoinExtend(props, { 
    graphNode: graphNode
   })); 
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => {
    const saViewIndex = state.saViews_.currentSaViewIndex;
    const saView = state.saViews_.saViews[saViewIndex];
    const saGraphView = state.graphs_.saGraphViews[saView.saGraphViewIndex];
    const graph = state.graphs_.graphs[saGraphView.graphIndex];
    return objectJoin<StateProps>(state as StateProps, { saViewIndex: saViewIndex, saView: saView, saGraphView: saGraphView, graph: graph });
  },
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      changeCurrentNode: (saGraphViewIndex: number, graphNode: GraphNode) => dispatch(createChangeCurrentNodeAction(saGraphViewIndex, graphNode)),
      changeCurrentSaGraphView: (saViewIndex: number, saGraphViewIndex: number) => dispatch(createChangeSaViewSaGraphViewAction(saViewIndex, saGraphViewIndex)),
      changeCurrentGraph: (saGraphViewIndex: number, graphIndex: number) => dispatch(createChangeSaGraphViewGraphAction(saGraphViewIndex, graphIndex)),
      createDialogMenuDialog: (originatingSaViewIndex: number) => dispatch(createCreateDialogMenuDialogAction(originatingSaViewIndex)),
      showAlertModal: (originatingGraphIndex: number, message: string) => dispatch(createShowAlertModalAction(originatingGraphIndex, message)),
      createDeleteGraphDialog: (graphIndex: number, originatingSaViewIndex: number) => dispatch(createCreateDeleteGraphDialogAction(graphIndex, originatingSaViewIndex)),
      createAddTripleDialog: (graphNode: GraphNode, originatingSaViewIndex: number) => dispatch(createCreateAddTripleDialogAction(graphNode, originatingSaViewIndex))
    };
  });
