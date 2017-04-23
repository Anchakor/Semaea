import * as Test from "Test";
import * as Request from "Server/Request";
import * as Response from "Server/Response";
import * as ServerClient from "Server/Client";
import { IDirectoryEntry } from 'Server/Filesystem';

export function run() {

  Test.testAsync("Integration Request", function(assert, asyncDone) {
    const c = (new Request.UnrecognizedRequest());
    const p1 = ServerClient.request(c, "ListDirectoryResponse")
    .catch((response) => {
      const expected = new Response.ErrorResponse();
      expected.message = "RequestHandler: Unrecognized request.";
      assert.serializedEqual(response, expected, "When sending unrecognized request, received correct ErrorResponse");
      asyncDone();
    });
  });

  Test.testAsync("Integration Filesystem ListDirectoryRequest", function(assert, asyncDone) {
    const c = new Request.ListDirectoryRequest();
    { c.dirPath = "test/static"; }
    const p1 = ServerClient.request(c, "ListDirectoryResponse")
    .then((response) => {
      const expected = new Response.ListDirectoryResponse();
      expected.listing = new Array<IDirectoryEntry>();
      expected.listing.push({ "kind": "directory", "name": "tdir" } as IDirectoryEntry);
      expected.listing.push({ "kind": "file", "name": "tfile.txt" } as IDirectoryEntry);
      assert.serializedEqual(response, expected, "When sending correct request, received correct ListDirectoryResponse");
    });

    c.dirPath = "nonexistantTest";
    const p2 = ServerClient.request(c, "ListDirectoryResponse")
    .catch((response) => {
      const expected = new Response.ErrorResponse();
      expected.message = "{\"errno\":-2,\"code\":\"ENOENT\",\"syscall\":\"scandir\",\"path\":\"nonexistantTest\"}";
      assert.serializedEqual(response, expected, "When sending request for nonexisting directory, received correct ErrorResponse");
    });

    Promise.all([ p1, p2 ]).then(asyncDone).catch(asyncDone);
  });
}