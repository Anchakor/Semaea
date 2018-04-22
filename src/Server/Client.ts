import { portNumber } from '../Server/Config';
import { Request } from '../Server/Request';
import * as RequestHandler from '../Server/RequestHandler';
import * as Response from '../Server/Response';
import { Log } from '../Common';

export function requestSimple(request: Request): Promise<Response.Response> {
  return send(request)
  .then((responseString) => JSON.parse(responseString) as Response.Response)
  .catch((err) => Response.createErrorResponse(err));
}

export function request<T extends Response.Response>(request: Request, responseKind: Response.ResponseKind): Promise<T> {
  return requestSimple(request)
  .then((response) => {
    if (response.kind == responseKind) return Promise.resolve(response as T);
    else return Promise.reject(response);
  });
}

/** Send request to get a response string. To get a Response object call request() */
export function send(request: Request): Promise<string> {
  Log.debug('Sending request: '+JSON.stringify(request));
  return sendString(JSON.stringify(request));
}

/** Send request string to get a response string. To get Response object call request() */
export function sendString(request: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const url = 'http://127.0.0.1:'+portNumber+'/';
      const req = new XMLHttpRequest();
      req.overrideMimeType('application/json');
      req.open('POST', url, true);
      req.setRequestHeader('Content-type','application/json; charset=utf-8');

      req.onload = (ev) => {
        resolve(req.responseText);
      };
      req.onabort = (ev) => {
        reject(req.responseText);
      };
      req.onerror = (ev) => {
        reject(new Error('Error sending request to url: '+url));
      };
  
      req.send(request);
    } catch(ex) {
      reject(ex);
    }
  });
}