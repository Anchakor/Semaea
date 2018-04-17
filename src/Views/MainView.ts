import { $, h, UIStoreLib, hc } from '../External';
import { Model } from '../Model';
import { store, StoreState } from '../UIStore/Main';
import * as SaViewView from './SaViewView';
import * as DialogView from './DialogView';
import * as GraphView from './GraphView';
import * as ModalsView from './ModalsView';
import { MainDispatchProps } from './MainDispatchProps';
import { CurrentProps } from './CurrentProps';

export type MainProps = StoreState & MainDispatchProps & { current: CurrentProps }

export class MainView {
  static render(model: Model) {
    MainView.focusElemIdToFocus(model);
    
    return hc(UIStoreLib.Provider, { store: store, children: undefined }, 
      h('div', {}, [
        hc(ModalsView.Component),
        hc(SaViewView.Component),
        hc(DialogView.Component),
        hc(GraphView.Component),
        ])
      );
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