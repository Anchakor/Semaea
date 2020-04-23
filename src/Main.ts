import { UILib, $ } from './External';
import { MainView } from './Views/MainView';
import { runUIStoreTests } from 'UIStore/UIStoreTests';
import { runGraphTests } from 'Graphs/GraphTests';
import { runServerIntegrationTests } from 'Server/IntegrationTests';

export function run(attachPoint: HTMLElement) {
  UILib.render(MainView.render(), attachPoint);
  
  runGraphTests();
  runUIStoreTests();
  runServerIntegrationTests();
}

window.onload = (function(oldLoad: any){
  return function(){
    oldLoad && oldLoad();
    run($('#main-attach'));
  }
})(window.onload)