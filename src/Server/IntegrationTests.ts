import * as Test from "Test";
import * as Request from "Server/Request";
import * as Response from "Server/Response";
import * as ServerClient from "Server/Client";
import { IDirectoryEntry } from 'Server/Filesystem';

export function run() {

  Test.testAsync("Integration Filesystem ListDirectoryRequest", function(assert, asyncDone) {
    const c = new Request.ListDirectoryRequest();
    { c.dirPath = "test"; }
    ServerClient.request(c, "ListDirectoryResponse")
    .then((response) => {
      const expected = new Response.ListDirectoryResponse();
      expected.listing = new Array<IDirectoryEntry>();
      expected.listing.push({ "kind": "directory", "name": "tdir" } as IDirectoryEntry);
      expected.listing.push({ "kind": "file", "name": "tfile.txt" } as IDirectoryEntry);
      assert.serializedEqual(response, expected, "Received correct ListDirectoryResponse");
      asyncDone();
    });
  });
}