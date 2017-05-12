import { createChangeCurrentNodeAction } from '../UIStore/Graph';
import { Graph } from '../Graphs/Graph';
import { h, StoreLib, UIComponent, connect } from '../External';
import * as EntityView from '../Views/EntityView';
import { Model } from '../Model';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { State as StoreState, mapFullStateToProps } from '../UIStore/Main';
import { objectJoin } from "../Common";

// View (functional component):

export interface StateProps extends StoreState {
  graphIndex: number
}
export interface DispatchProps {
  changeCurrentNode: (graphIndex: number, graphNode: GraphNode) => void
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    if (!this.props.graph.graphs[this.props.graphIndex]) {
      return h('div', {}, 'Viewed graph is undefined');
    }
    return h('div', {}, this.props.graph.graphs[this.props.graphIndex].graph.get().map((triple: Triple) => {
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
    graphMeta: props.graph.graphs[props.graphIndex].meta
   })); 
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => objectJoin(state, { graphIndex: state.graph.currentGraphIndex }),
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      changeCurrentNode: (graphIndex: number, graphNode: GraphNode) => dispatch(createChangeCurrentNodeAction(graphIndex, graphNode))
    };
  });
