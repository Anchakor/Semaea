import { objectJoinExtend, Log } from '../Common';
import { DispatchProps } from '../UIStore/Main';
import { UIComponent, FunctionalUIComponent, hf } from '../External';
import { FocusTarget, createSetChangeFocusToNoneAction, State as FocusState } from '../UIStore/Focus';

type FocusProps = DispatchProps & { focus_: FocusState };

/** Base class for focusable UI Components. */
export function withFocusable<InnerProps>(
  innerComponent: FunctionalUIComponent<InnerProps>, 
  focusTarget: FocusTarget,
  innerComponentName?: (p: InnerProps) => string) {
return class FocusableComponent extends UIComponent<InnerProps & FocusProps, { elem: HTMLElement }> {
    constructor(props: InnerProps & FocusProps, context?: any) { super(props, context); }
    render() {
      let innerProps: InnerProps = objectJoinExtend(this.props, {
        onComponentDidMount: (e: HTMLElement) => { 
          this.setState({ elem: e }); 
        },
        onComponentDidUpdate: (lastProps: InnerProps & FocusProps, nextProps: InnerProps & FocusProps) => { 
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
}
