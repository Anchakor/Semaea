import { Graph } from '../Graphs/Graph';
import { h, StoreLib, UIComponent, connect } from '../External';
import * as EntityView from '../Views/EntityView';
import { Model } from '../Model';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { State as StoreState, mapFullStateToProps } from '../UIStore/Main';

// View (functional component):

export interface StateProps extends StoreState {
}
export interface DispatchProps {
  onSomeUpdate: () => void
}
export type Props = StateProps & DispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props?: Props, context?: any) { super(props, context); }
  public render() {
    return h('div', {}, this.props.graph.graphs[0].graph.get().map((triple: Triple) => {
      return h('div', {}, [
        renderLevelPosition(this.props, new GraphNode(triple, 's')), ' ',
        renderLevelPosition(this.props, new GraphNode(triple, 'p')), ' ',
        renderLevelPosition(this.props, new GraphNode(triple, 'o'))
        ]);
    }));
  }
}

function renderLevelPosition(props: Props, graphNode: GraphNode) {
  return h(EntityView.EntityView, Object.assign({}, props, { graphNode: graphNode })); 
}

// Component (container component):

export const Component = connect(
  View,
  mapFullStateToProps,
  (dispatch: <A extends StoreLib.Action>(action: A) => void, ownProps?: {}): DispatchProps => { 
    return {
      onSomeUpdate: () => {
        //return dispatch(createTestIncrementStoreAction());
      }
    };
  });
