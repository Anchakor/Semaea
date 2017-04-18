import { portNumber } from "Server/Config";
import { Request } from "Server/Request";
import * as Response from "Server/Response";
import * as RequestHandler from "Server/RequestHandler";

export function requestSimple(request: Request): Promise<Response.Response> {
  return send(request)
  .then((responseString) => JSON.parse(responseString) as Response.Response)
  .catch((err) => Response.createErrorResponse(err));
}

export function request(request: Request, responseKind: Response.ResponseKind): Promise<Response.Response> {
  return requestSimple(request)
  .then((response) => {
    if (response.kind == responseKind) return response;
    else return Promise.reject(response);
  });
}

/** Send request to get a response string. To get a Response object call request() */
export function send(request: Request): Promise<string> {
  return sendString(JSON.stringify(request));
}

/** Send request string to get a response string. To get Response object call request() */
export function sendString(request: string): Promise<string> {
  const req = new XMLHttpRequest();
  req.overrideMimeType("application/json");
  req.open("POST", "http://127.0.0.1:"+portNumber+"/", true);
  req.setRequestHeader("Content-type","application/json; charset=utf-8");

  const output = new Promise<string>((resolve, reject) => {
    req.addEventListener("load", function (this: XMLHttpRequest) {
      resolve(this.responseText);
    });
    req.addEventListener("error", function (this: XMLHttpRequest) {
      reject(this.responseText);
    });
    req.addEventListener("abort", function (this: XMLHttpRequest) {
      reject(this.responseText);
    });
  });
  
  req.send(request);

  return output;
}