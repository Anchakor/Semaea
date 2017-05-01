import { h, $, Component } from '../External';
import * as GraphView from '../Views/GraphView';
import * as ModalsView from '../Views/ModalsView';
import { Model } from '../Model';

export class MainView {
  static render(model: Model) {
    MainView.focusElemIdToFocus(model);
    
    return h('div', {}, [
      GraphView.render(model),
      ModalsView.render(model),
      h(TestingView)
      ]);
  }

  static focusElemIdToFocus(model: Model) {
    setTimeout(() => {
      if (model.elemIdToFocus && model.elemIdToFocus != '') {
        const elem = $('#'+model.elemIdToFocus)
        if (elem) { elem.focus(); }
      }
    }, 0);
  }
}

export class TestingView extends Component<{}, { x: number }> {
  state = { x: 10 }
  constructor(props?: {}, context?: any) { super(props, context); }
  public render() {
    setTimeout(() => {
      this.setState({ x: this.state.x+1 });
    }, 1000);
    return h('p', {}, [
      h('span', {}, 'counter: '),
      h('span', {}, this.state.x.toString())
    ]);
  }
}