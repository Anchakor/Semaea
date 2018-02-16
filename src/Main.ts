import { UILib, $ } from './External';
import { MainView } from './Views/MainView';
import { Triple } from './Graphs/Triple';
import { Graph } from './Graphs/Graph';
import { Model } from './Model';
import { runUIStoreTests } from 'UIStore/UIStoreTests';
import { runGraphTests } from 'Graphs/GraphTests';
import { runServerIntegrationTests } from 'Server/IntegrationTests';

export function run(attachPoint: HTMLElement) {
  const model1 = new Model();
  UILib.render(MainView.render(model1), attachPoint);
  
  runGraphTests();
  runUIStoreTests();
  runServerIntegrationTests();
}

window.onload = (function(oldLoad: any){
  return function(){
    oldLoad && oldLoad();
    run($('#plastiq'));
  }
})(window.onload)