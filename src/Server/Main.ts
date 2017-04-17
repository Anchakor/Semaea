import http = require("http") // TODO "https"
import fs = require("fs");
import { Triple } from "Graphs/Triple";
import * as CommandHandler from "Server/CommandHandler";
import { portNumber, maxRequestBytes } from "Server/Config";

export function run() {
  const triple = new Triple("s", "p", "o");
  console.log(triple.toString());

  const options = {
    //key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
    //cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
  };

  console.log("Starting server at http://127.0.0.1:"+portNumber+"/");

  http.createServer(/*options,*/ (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.method == "OPTIONS") {
      setCORSHeaders(res);
      res.writeHead(200);
      res.end();
      return;
    }

    let requestString = '';
    req.addListener("data", (chunk) => {
      requestString += chunk;
      if (requestString.length > maxRequestBytes) { 
          // flood attach, kill connection
          req.connection.destroy();
      }
    });

    new Promise((resolve, reject) => req.addListener("end", resolve))
    .then<string>(() => CommandHandler.handle(requestString))
    .then((output) => { 
      if (output) sendOutput(output, res);
      else throw new Error("CommandHandler output null.");
    })
    .catch((err) => sendOutput(CommandHandler.prepareErrorResponse(err), res));
  }).listen(portNumber);
}

function sendOutput(output: string, res: http.ServerResponse) {
  setCORSHeaders(res);
  res.setHeader("Content-type","application/json; charset=utf-8");
  if (!output) {
    res.writeHead(500);
    res.end();
    return;
  }
  res.writeHead(200);
  res.write(output);
  res.end();
}

function setCORSHeaders(res: http.ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}