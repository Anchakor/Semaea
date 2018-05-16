import { objectJoinExtend, Log } from '../Common';
import { StoreState } from '../UIStore/Main';
import { MainDispatchProps } from './MainDispatchProps';
import { UIComponent, FunctionalUIComponent, hf } from '../External';
import { FocusTarget } from '../UIStore/Focus';

/** Base class for focusable UI Components. If it shoudln't focus set `doFocus` to false. */
export abstract class FocusableComponent<TProps extends StoreState & MainDispatchProps> extends UIComponent<TProps, { elem: HTMLElement }> {
  constructor(props: TProps, context?: any) { super(props, context); }
  render() {
    let innerProps = objectJoinExtend(this.props, {
      onComponentDidMount: (e: HTMLElement) => { 
        this.setState({ elem: e }); 
      },
      onComponentDidUpdate: (lastProps: TProps, nextProps: TProps) => { 
        if (this.state && nextProps.focus_.changeFocusTo && this.additionalFocusCondition(lastProps, nextProps)
          && nextProps.focus_.changeFocusTo == this.focusTarget) {
            Log.debug("Focusing FocusableComponent: "+this.getInnerComponentName());
            // Look for the debug logging between non-empty SetChangeFocusTo action and the empty one (acknowledge)
            this.state.elem.focus();
            nextProps.acknowledgeFocusChange();
        }
      }
    });
    return hf(this.innerComponent, innerProps);
  }

  abstract readonly innerComponent: FunctionalUIComponent<TProps>;
  abstract readonly focusTarget: FocusTarget;
  additionalFocusCondition(lastProps: TProps, nextProps: TProps) { return true; };
  innerComponentName?: string = undefined;
  private getInnerComponentName() { return (this.innerComponentName) ? this.innerComponentName :  this.innerComponent.name; }
}
