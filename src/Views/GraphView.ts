import { objectJoin } from '../Common';
import { connect, h, StoreLib, UIComponent } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { createChangeCurrentGraphAction, createChangeCurrentNodeAction } from '../UIStore/Graphs';
import { State as StoreState } from '../UIStore/Main';
import * as EntityView from '../Views/EntityView';

// View (component):

export interface StateProps extends StoreState {
  graphIndex: number
}
export interface DispatchProps {
  changeCurrentGraph: (graphIndex: number) => void
  changeCurrentNode: (graphIndex: number, graphNode: GraphNode) => void
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    return h('div', {}, [
      this.renderGraphSwitchingBar(),
      h('hr'),
      this.renderCurrentGraph()
    ]);
  }

  private renderGraphSwitchingBar() {
    return h('div', {}, [
      h('span', {}, "Graphs: ")
    ].concat(this.props.graphs_.graphs.map((g, i) => {
      let tagClass: string = '';
      if (this.props.graphIndex == i) {
        tagClass = 'element-selected'
      }
      return h('button', { 
        class: tagClass,
        onclick: () => this.props.changeCurrentGraph(i)
      }, i.toString())
    })));
  }

  private renderCurrentGraph() {
    if (!this.props.graphs_.graphs[this.props.graphIndex]) {
      return h('div', {}, 'Viewed graph is undefined');
    }
    return h('div', {}, this.props.graphs_.graphs[this.props.graphIndex].graph.get().map((triple: Triple) => {
      return h('div', {}, [
        renderLevelPosition(this.props, new GraphNode(triple, 's')), ' ',
        renderLevelPosition(this.props, new GraphNode(triple, 'p')), ' ',
        renderLevelPosition(this.props, new GraphNode(triple, 'o'))
        ]);
    }));
  }
}

function renderLevelPosition(props: Props, graphNode: GraphNode) {
  return h(EntityView.EntityView, objectJoin(props, { 
    graphNode: graphNode,
    graphMeta: props.graphs_.graphs[props.graphIndex].meta
   })); 
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => objectJoin(state, { graphIndex: state.graphs_.currentGraphIndex }),
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      changeCurrentNode: (graphIndex: number, graphNode: GraphNode) => dispatch(createChangeCurrentNodeAction(graphIndex, graphNode)),
      changeCurrentGraph: (graphIndex: number) => dispatch(createChangeCurrentGraphAction(graphIndex))
    };
  });
