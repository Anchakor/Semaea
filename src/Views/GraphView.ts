import { objectJoin, objectJoinExtend } from '../Common';
import { connect, h, StoreLib, UIComponent, hc, hf, Dispatch } from '../External';
import { GraphNode } from '../Graphs/GraphNode';
import { Triple } from '../Graphs/Triple';
import { Graph } from '../Graphs/Graph';
import { SaView } from '../SaViews';
import { SaGraphView } from '../UIStore/Graphs';
import { StoreState } from '../UIStore/Main';
import { createMainDispatchProps, MainDispatchProps } from './MainDispatchProps';
import * as EntityView from './EntityView';
import { getSaGraphViewFilteredTriples } from '../UIStore/GraphFilters';
import { GraphFilterComponent } from './GraphFilterView';
import { CurrentProps, getCurrentProps } from './CurrentProps';
import { ButtonKeyEventOptions, KeyEventOptions } from './InputEventHandlers';
import { createFocusableElementProps } from './FocusableElementProps';
import { FocusableComponent } from './FocusableComponent';
import { FocusTarget } from '../UIStore/Focus';

// View (component):

export interface StateProps extends StoreState {
  current: CurrentProps
}
export type Props = StateProps & MainDispatchProps

export class View extends UIComponent<Props, {}> {
  constructor(props: Props, context?: any) { super(props, context); }
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
      if (this.props.current.saView.saGraphViewIndex == i) {
        tagClass = 'element-selected'
      }
      return h('button', createFocusableElementProps(ButtonKeyEventOptions, this.props, { 
        class: tagClass,
        onclick: () => this.props.changeCurrentSaGraphView(this.props.current.saViewIndex, i)
      }), i.toString())
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
      if (this.props.current.saGraphView.graphIndex == graphIndex) {
        tagClass = 'element-selected'
      }
      return h('button', createFocusableElementProps(ButtonKeyEventOptions, this.props, { 
        class: tagClass,
        onclick: () => this.props.changeCurrentGraph(this.props.current.saGraphViewIndex, graphIndex)
      }), graphIndex.toString())
    })));
  }

  private renderCurrentGraph() {
    if (!this.props.current.graph) {
      return h('div', {}, 'Viewed graph is undefined');
    }
    const triples = getSaGraphViewFilteredTriples(this.props.current.saGraphView, this.props.current.graph);
    return h('div', {}, [hc(FocusableGraphView, this.props)]
      .concat(triples.map((triple: Triple) => {
        return h('div', {}, [
          renderLevelPosition(this.props, new GraphNode(triple, 's')), ' ',
          renderLevelPosition(this.props, new GraphNode(triple, 'p')), ' ',
          renderLevelPosition(this.props, new GraphNode(triple, 'o'))
          ]);
      }))
    );
  }
}

function renderLevelPosition(props: Props, graphNode: GraphNode) {
  return hf(EntityView.entityView, objectJoinExtend(props, { 
    graphNode: graphNode,
    isCurrentNode: isCurrentGraphNode(props, graphNode),
    isOccurenceOfCurrentNode: isSomeOccurenceOfCurrentGraphNode(props, graphNode)
   })); 
}

function isCurrentGraphNode(props: Props, graphNode: GraphNode): boolean {
  if (!props.current.saGraphView.currentNode) return false;
  return props.current.saGraphView.currentNode.equals(graphNode);
}

function isSomeOccurenceOfCurrentGraphNode(props: Props, graphNode: GraphNode): boolean {
  if (!props.current.saGraphView.currentNode) return false;
  return props.current.saGraphView.currentNode.getValue() == graphNode.getValue();
}

/** Empty focusable element for all GraphView entities (GraphNodes) */
class FocusableGraphView extends FocusableComponent<Props> {
  constructor(props: Props, context?: any) { super(props, context); }
  focusTarget = FocusTarget.GraphView
  innerComponent = (p: Props) => h('span', createFocusableElementProps(KeyEventOptions.Default, p, { tabindex: 0 }));
}

// Component (container component):

export const Component = connect(
  View,
  (state: StoreState) => {
    return objectJoin<StateProps>(state as StateProps, { current: getCurrentProps(state) });
  },
  (dispatch: Dispatch<StoreState>, ownProps?: {}): MainDispatchProps => { 
    return createMainDispatchProps(dispatch);
  });
