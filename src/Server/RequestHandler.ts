import * as Response from '../Server/Response';
import { Request, requestIsOfKind, RequestKind } from '../Server/Request';
import { listDirectory, readFile, writeFile } from '../Server/Filesystem';
import * as cbor from 'cbor-js';
import { Log } from '../Common';

export function handle(requestBytes: ArrayBuffer): Promise<ArrayBuffer> {
  try {
    const request = cbor.decode(requestBytes) as Request;
    Log.log('handling request: '+JSON.stringify(request));
    return handleRequest(request)
      .catch((err) => Promise.resolve(createResponse(
        Response.createErrorResponse(err))));
  } catch (ex) {
    return Promise.resolve(createResponse(
      Response.createErrorResponse(ex)));
  }
}

function handleRequest(request: Request) {
  if (requestIsOfKind(RequestKind.ListDirectoryRequest)(request)) {
    return listDirectory(request.dirPath).then((listing) => {
      const r = new Response.ListDirectoryResponse();
      r.listing = listing
      return createResponse(r);
    });
  } else if (requestIsOfKind(RequestKind.ReadFileRequest)(request)) {
    return readFile(request.filePath).then((content) => {
      const r = new Response.ReadFileResponse();
      r.content = new Uint8Array(content);
      return createResponse(r);
    });
  } else if (requestIsOfKind(RequestKind.WriteFileRequest)(request)) {
    return writeFile(request.filePath, request.content).then(() => {
      const r = new Response.WriteFileResponse();
      return createResponse(r);
    });
  } else {
    return Promise.resolve(createResponse(
      Response.createErrorResponse('RequestHandler: Unrecognized request.')));
  }
}

export function createResponse(response: Object) {
  return cbor.encode(response);
}
