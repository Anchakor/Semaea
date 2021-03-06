import { $, h, UIStoreLib, hc } from '../External';
import { store } from '../UIStore/Main';
import * as SaViewView from './SaViewView';
import * as DialogView from './DialogView';
import * as GraphView from './GraphView';
import * as ModalsView from './ModalsView';

export class MainView {
  static render() {    
    return hc(UIStoreLib.Provider, { store: store }, 
      h('div', {}, [
        hc(ModalsView.Component),
        hc(SaViewView.Component),
        hc(DialogView.Component),
        hc(GraphView.Component),
        ])
      );
  }
}