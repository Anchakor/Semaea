import { portNumber } from "Server/Config";
import { Request } from "Server/Request";

export function send(request: Request): Promise<string> {
  return sendString(JSON.stringify(request));
}

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