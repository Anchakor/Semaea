import http = require('http') // TODO 'https'
import fs = require('fs');
import { Triple } from '../Graphs/Triple';
import * as RequestHandler from '../Server/RequestHandler';
import * as Response from '../Server/Response';
import { portNumber, maxRequestBytes } from '../Server/Config';
import { Log, concatArrayOfBuffers } from 'Common';

export function run() {
  const triple = new Triple('s', 'p', 'o');
  Log.log(triple.toString());

  const options = {
    //key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
    //cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
  };

  Log.log('Starting server at http://127.0.0.1:'+portNumber+'/');

  http.createServer(/*options,*/ (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (req.method == 'OPTIONS') {
      setCORSHeaders(res);
      res.writeHead(200);
      res.end();
      return;
    }

    let requestBuffers = new Array<Buffer>();
    req.addListener('data', (chunk: Buffer) => {
      requestBuffers.push(chunk);
      if (requestBuffers.map(x => x.length).reduce((p,c) => p+c) > maxRequestBytes) { 
          // flood attack, kill connection
          req.connection.destroy();
      }
    });

    new Promise((resolve, reject) => req.addListener('end', resolve))
    .then<ArrayBuffer>(() => {
      const buf = concatArrayOfBuffers(requestBuffers);
      return RequestHandler.handle(buf.buffer)}
    )
    .then((output) => { 
      if (output) sendOutput(output, res);
      else throw new Error('RequestHandler output null.');
    })
    .catch((err) => { Log.error(err);
      sendOutput(RequestHandler.createResponse(Response.createErrorResponse(err)), res)
    });  
  }).listen(portNumber);
}

function sendOutput(output: ArrayBuffer, res: http.ServerResponse) {
  setCORSHeaders(res);
  res.setHeader('Content-type','text/plain; charset=x-user-defined');
  if (!output) {
    res.writeHead(500);
    res.end();
    return;
  }
  res.writeHead(200);
  res.write(Buffer.from(output));
  res.end();
}

function setCORSHeaders(res: http.ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
}