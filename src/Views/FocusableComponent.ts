import { objectJoinExtend, Log } from '../Common';
import { DispatchProps, FocusProps, StoreState } from '../UIStore/Main';
import { UIComponent, FunctionalUIComponent, hf, connect, Dispatch } from '../External';
import { FocusTarget, createSetChangeFocusToNoneAction, State as FocusState } from '../UIStore/Focus';

type Props = DispatchProps & FocusProps;

/** Base class for focusable UI Components. */
export function withFocusable<InnerProps>(
  innerComponent: FunctionalUIComponent<InnerProps>, 
  focusTarget: FocusTarget,
  innerComponentName?: (p: InnerProps) => string)
{
  class FocusableComponent extends UIComponent<InnerProps & Props, { elem: HTMLElement }> {
    constructor(props: InnerProps & Props, context?: unknown) { super(props, context); }
    render() {
      let innerProps: InnerProps = objectJoinExtend(this.props, {
        onComponentDidMount: (e: HTMLElement) => { 
          this.setState({ elem: e }); 
        },
        onComponentDidUpdate: (lastProps: InnerProps & Props, nextProps: InnerProps & Props) => { 
          if (this.state && nextProps.focus_.changeFocusTo && nextProps.focus_.changeFocusTo == focusTarget) {
              Log.debug("Focusing FocusableComponent: "+this.getInnerComponentName());
              // Look for the debug logging between non-empty SetChangeFocusTo action and the empty one (acknowledge)
              this.state.elem.focus();
              nextProps.dispatch(createSetChangeFocusToNoneAction());
          }
        }
      });
      return hf(innerComponent, innerProps);
    }

    private getInnerComponentName() { return (innerComponentName) ? innerComponentName(this.props) : innerComponent.name; }
  }
  const Component = connect(
    FocusableComponent,
    (state: StoreState, ownProps: InnerProps) => {
      return objectJoinExtend<InnerProps, FocusProps>(ownProps, { focus_: state.focus_ });
    },
    (dispatch: Dispatch<StoreState>, ownProps: InnerProps): DispatchProps => { 
      return { dispatch: dispatch };
    });

  return Component;
}
