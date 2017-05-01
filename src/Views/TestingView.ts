import { h, Component } from '../External';

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