import { portNumber } from '../Server/Config';
import { Request } from '../Server/Request';
import * as RequestHandler from '../Server/RequestHandler';
import * as Response from '../Server/Response';
import { Log } from '../Common';
import * as cbor from 'cbor-js';

export function requestSimple(request: Request): Promise<Response.Response> {
  return send(request)
  .then((responseArrayBuffer) => cbor.decode(responseArrayBuffer) as Response.Response)
  .catch((err) => Response.createErrorResponse(err));
}

export function request<T extends Response.Response>(request: Request, responseKind: Response.ResponseKind): Promise<T> {
  return requestSimple(request)
  .then((response) => {
    if (response.kind == responseKind) return Promise.resolve(response as T);
    else return Promise.reject(response);
  });
}

/** Send request to get a response ArrayBuffer. To get a Response object call request() */
export function send(request: Request): Promise<ArrayBuffer> {
  Log.debug('Sending request: '+JSON.stringify(request));
  return sendData(createRequest(request));
}

/** Send request ArrayBuffer to get a response ArrayBuffer. To get Response object call request() */
export function sendData(request: ArrayBuffer): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    try {
      const url = 'http://127.0.0.1:'+portNumber+'/';
      const req = new XMLHttpRequest();
      req.overrideMimeType('text/plain; charset=x-user-defined');
      req.open('POST', url, true);
      req.responseType = 'arraybuffer'
      req.setRequestHeader('Content-type','text/plain; charset=x-user-defined');

      req.onload = (ev) => {
        resolve(req.response);
      };
      req.onabort = (ev) => {
        reject(req.response);
      };
      req.onerror = (ev) => {
        reject(new Error('Error sending request to url: '+url));
      };
  
      req.send(request); // TODO send CBOR
    } catch(ex) {
      reject(ex);
    }
  });
}

function createRequest(request: Object) {
  return cbor.encode(request);
}