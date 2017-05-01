import { Model } from '../Model';
import { GraphNode } from '../Graphs/GraphNode';
import { IAction, Action } from '../Actions/IAction';
import * as Request from '../Server/Request';
import * as Response from '../Server/Response';
import * as ServerClient from '../Server/Client';
import { IDirectoryEntry } from '../Server/Filesystem';
import * as Autocomplete from '../Modals/Autocomplete';

export class OpenFileAction extends Action {
  label = 'Open file';
  dirPath = '.';
  formLabel = '';
  execute = (model: Model, graphNode: GraphNode) => { //alert('asdf');}
    const getDirList = (): Promise<Response.ListDirectoryResponse> => {
      const req = new Request.ListDirectoryRequest();
      { req.dirPath = this.dirPath; }
      return ServerClient.request(req, 'ListDirectoryResponse');
    }
    const showList = () => getDirList().then((response) => {
      this.formLabel = 'Open file (directory: '+this.dirPath+')';
      Autocomplete.showAutocompleteForm(model, response.listing, this.formLabel, (a) => a.name, true)
      .then((result) => {
        if (result.value) {
          if (result.value.kind === 'directory') {
            this.dirPath += '/'+result.value.name;
            showList();
          } else {
            alert('opening file '+result.value.name+' in dirPath '+this.dirPath);
          }
          //result.value.execute(model, graphNode);
        }
      });
    });
    showList();
  };
}