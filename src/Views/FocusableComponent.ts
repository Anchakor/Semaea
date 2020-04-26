import { objectJoinExtend, Log } from '../Common';
import { DispatchProps } from '../UIStore/Main';
import { UIComponent, FunctionalUIComponent, hf } from '../External';
import { FocusTarget, createSetChangeFocusToNoneAction, State as FocusState } from '../UIStore/Focus';

/** Base class for focusable UI Components. */
export abstract class FocusableComponent<TProps extends DispatchProps & { focus_: FocusState}> extends UIComponent<TProps, { elem: HTMLElement }> {
  constructor(props: TProps, context?: any) { super(props, context); }
  render() {
    let innerProps = objectJoinExtend(this.props, {
      onComponentDidMount: (e: HTMLElement) => { 
        this.setState({ elem: e }); 
      },
      onComponentDidUpdate: (lastProps: TProps, nextProps: TProps) => { 
        if (this.state && nextProps.focus_.changeFocusTo && nextProps.focus_.changeFocusTo == this.focusTarget) {
            Log.debug("Focusing FocusableComponent: "+this.getInnerComponentName());
            // Look for the debug logging between non-empty SetChangeFocusTo action and the empty one (acknowledge)
            this.state.elem.focus();
            nextProps.dispatch(createSetChangeFocusToNoneAction());
        }
      }
    });
    return hf(this.innerComponent, innerProps);
  }

  abstract readonly innerComponent: FunctionalUIComponent<TProps>;
  abstract readonly focusTarget: FocusTarget;
  innerComponentName?: string = undefined;
  private getInnerComponentName() { return (this.innerComponentName) ? this.innerComponentName :  this.innerComponent.name; }
}
