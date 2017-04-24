import * as Response from 'Server/Response';
import { Request, ListDirectoryRequest } from 'Server/Request';
import { listDirectory, readFileString, writeFileString } from "Server/Filesystem";

export function handle(requestString: string): Promise<string> {
  try {
    console.log("handling request: "+requestString);
    const request = JSON.parse(requestString) as Request;
    return handleRequest(request)
      .catch((err) => Promise.resolve(createResponseString(
        Response.createErrorResponse(err))));
  } catch (ex) {
    return Promise.resolve(createResponseString(
      Response.createErrorResponse(ex)));
  }
}

function handleRequest(request: Request) {
  switch (request.kind) {
    case "ListDirectoryRequest":
      return listDirectory(request.dirPath).then((listing) => {
        const r = new Response.ListDirectoryResponse();
        r.listing = listing
        return createResponseString(r);
      });
    case "ReadFileRequest":
      return readFileString(request.filePath).then((content) => {
        const r = new Response.ReadFileResponse();
        r.content = content;
        return createResponseString(r);
      });
    case "WriteFileRequest":
      return writeFileString(request.filePath, request.content).then(() => {
        const r = new Response.WriteFileResponse();
        return createResponseString(r);
      });
    default:
      return Promise.resolve(createResponseString(
        Response.createErrorResponse("RequestHandler: Unrecognized request.")));
  }
}

export function createResponseString(response: Object) {
  return JSON.stringify(response);
}
