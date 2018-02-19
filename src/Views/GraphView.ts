import { objectJoin, objectJoinExtend } from '../Common';
import { connect, h, StoreLib, UIComponent, hc, hf } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { Graph } from '../Graphs/Graph';
import { SaView } from '../SaViews';
import { SaGraphView } from '../UIStore/Graphs';
import { StoreState } from '../UIStore/Main';
import { createGraphDispatchProps, GraphDispatchProps } from './GraphDispatchProps';
import * as EntityView from './EntityView';
import { getSaGraphViewFilteredTriples } from '../UIStore/GraphFilters';
import { GraphFilterComponent } from './GraphFilterView';

// View (component):

export interface StateProps extends StoreState {
  saViewIndex: number
  saView: SaView
  saGraphView: SaGraphView
  graph: Graph
}
export type Props = StateProps & GraphDispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    return h('div', {}, [
      this.renderSaGraphViewSwitchingBar(),
      this.renderGraphSwitchingBar(),
      hc(GraphFilterComponent, this.props),
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
    const triples = getSaGraphViewFilteredTriples(this.props.saGraphView, this.props.graph);
    return h('div', {}, triples.map((triple: Triple) => {
      return h('div', {}, [
        renderLevelPosition(this.props, new GraphNode(triple, 's')), ' ',
        renderLevelPosition(this.props, new GraphNode(triple, 'p')), ' ',
        renderLevelPosition(this.props, new GraphNode(triple, 'o'))
        ]);
    }));
  }
}

function renderLevelPosition(props: Props, graphNode: GraphNode) {
  return hc(EntityView.EntityView, objectJoinExtend(props, { 
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
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): GraphDispatchProps => { 
    return createGraphDispatchProps(dispatch);
  });
