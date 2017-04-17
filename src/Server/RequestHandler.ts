import * as Response from 'Server/Response';
import { Request, ListDirectoryRequest } from 'Server/Request';
import { listDirectory } from "Server/Filesystem";

export function handle(requestString: string): Promise<string> {
  try {
    console.log("handling request: "+requestString);
    const request = JSON.parse(requestString) as Request;
    return handleRequest(request);
  } catch (ex) {
    return Promise.resolve(prepareErrorResponse(ex));
  }
}

function handleRequest(request: Request) {
  switch (request.kind) {
    case "ListDirectoryRequest":
      return listDirectory(request.dirPath).then((listing) => {
        const r = new Response.ListDirectoryResponse();
        r.listing = listing
        return prepareResponse(r);
      });
    default:
      return Promise.resolve(prepareErrorResponse("RequestHandler: Unrecognized request."));
  }
}

export function prepareErrorResponse(err: any) {
  const r = new Response.ErrorResponse();
  if (err) {
    if (typeof err === "string") {
      r.message = err
    } else if (typeof err === "object") {
      r.message = JSON.stringify(err);
    }
  }
  return JSON.stringify(r);
}

function prepareResponse(response: Object) {
  return JSON.stringify(response);
}
