import https = require("http") // TODO "https"
import fs = require("fs");
import { Triple } from "Graphs/Triple";

const portNumber = 8000;

export function run() {
  const triple = new Triple("s", "p", "o");
  console.log(triple.toString());

  const options = {
    //key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
    //cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
  };

  console.log("Starting server at http://127.0.0.1:"+portNumber+"/");

  https.createServer(/*options,*/ (req:any, res:any) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(portNumber);
}

