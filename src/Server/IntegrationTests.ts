import * as Test from "Test";
import * as Request from "Server/Request";
import * as Response from "Server/Response";
import * as ServerClient from "Server/Client";
import { IDirectoryEntry } from 'Server/Filesystem';

export function run() {

  Test.testAsync("Integration Request", function(assert, asyncDone) {
    const req = (new Request.UnrecognizedRequest());
    const p1 = ServerClient.request(req, "ListDirectoryResponse")
    .catch((response) => {
      const expected = new Response.ErrorResponse();
      { expected.message = "RequestHandler: Unrecognized request."; }
      assert.serializedEqual(response, expected, "When sending unrecognized request, received correct ErrorResponse.");
      asyncDone();
    });
  });

  Test.testAsync("Integration Filesystem ListDirectoryRequest", function(assert, asyncDone) {
    const req = new Request.ListDirectoryRequest();
    { req.dirPath = "test/static"; }
    const p1 = ServerClient.request(req, "ListDirectoryResponse")
    .then((response) => {
      const expected = new Response.ListDirectoryResponse();
      { expected.listing = new Array<IDirectoryEntry>();
        expected.listing.push({ "kind": "directory", "name": "tdir" } as IDirectoryEntry);
        expected.listing.push({ "kind": "file", "name": "tfile.txt" } as IDirectoryEntry); }
      assert.serializedEqual(response, expected, "When sending correct request, received correct ListDirectoryResponse.");
    });

    req.dirPath = "test/static/nonexistantTest";
    const p2 = ServerClient.request(req, "ListDirectoryResponse")
    .catch((response) => {
      const expected = new Response.ErrorResponse();
      { expected.message = "{\"errno\":-2,\"code\":\"ENOENT\",\"syscall\":\"scandir\",\"path\":\"test/static/nonexistantTest\"}"; }
      assert.serializedEqual(response, expected, "When sending request for nonexisting directory, received correct ErrorResponse.");
    });

    Promise.all([ p1, p2 ]).then(asyncDone).catch(asyncDone);
  });

  Test.testAsync("Integration Filesystem ReadFileRequest", function(assert, asyncDone) {
    const req = new Request.ReadFileRequest();
    { req.filePath = "test/static/tfile.txt"; }
    const p1 = ServerClient.request(req, "ReadFileResponse")
    .then((response) => {
      const expected = new Response.ReadFileResponse();
      { expected.content = "tfile contents \n\nasdf"; }
      assert.serializedEqual(response, expected, "When sending correct request, received correct ReadFileResponse.");
    });

    { req.filePath = "test/static/nonexistantTestFile.txt"; }
    const p2 = ServerClient.request(req, "ReadFileResponse")
    .catch((response) => {
      const expected = new Response.ErrorResponse();
      { expected.message = "{\"errno\":-2,\"code\":\"ENOENT\",\"syscall\":\"open\",\"path\":\"test/static/nonexistantTestFile.txt\"}"; }
      assert.serializedEqual(response, expected, "When sending request for nonexisting directory, received correct ErrorResponse.");
    });

    Promise.all([ p1, p2 ]).then(asyncDone).catch(asyncDone);
  });
}