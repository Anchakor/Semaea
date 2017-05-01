import * as Test from '../Test';
import * as Request from '../Server/Request';
import * as Response from '../Server/Response';
import * as ServerClient from '../Server/Client';
import { IDirectoryEntry } from '../Server/Filesystem';

export function run() {

  Test.testAsync('Integration Request', function(assert, asyncDone) {
    const req = (new Request.UnrecognizedRequest());
    const p1 = ServerClient.request(req, 'ListDirectoryResponse')
    .catch((response) => {
      const expected = new Response.ErrorResponse();
      { expected.message = 'RequestHandler: Unrecognized request.'; }
      assert.serializedEqual(response, expected, 'When sending unrecognized request, received correct ErrorResponse.');
      asyncDone();
    });
  });

  Test.testAsync('Integration Filesystem ListDirectoryRequest', function(assert, asyncDone) {
    const req = new Request.ListDirectoryRequest();
    { req.dirPath = 'test/static'; }
    const p1 = ServerClient.request(req, 'ListDirectoryResponse')
    .then((response) => {
      const expected = new Response.ListDirectoryResponse();
      { expected.listing = new Array<IDirectoryEntry>();
        expected.listing.push({ 'kind': 'directory', 'name': 'tdir' } as IDirectoryEntry);
        expected.listing.push({ 'kind': 'file', 'name': 'tfile.txt' } as IDirectoryEntry); }
      assert.serializedEqual(response, expected, 'When sending correct request, received correct ListDirectoryResponse.');
    });

    req.dirPath = 'test/static/nonexistantTest';
    const p2 = ServerClient.request(req, 'ListDirectoryResponse')
    .catch((response) => {
      const expected = new Response.ErrorResponse();
      { expected.message = 'Error getting list of directory: test/static/nonexistantTest'; }
      assert.serializedEqual(response, expected, 'When sending request for nonexisting directory, received correct ErrorResponse.');
    });

    Promise.all([ p1, p2 ]).then(asyncDone).catch(asyncDone);
  });

  Test.testAsync('Integration Filesystem ReadFileRequest', function(assert, asyncDone) {
    const req = new Request.ReadFileRequest();
    { req.filePath = 'test/static/tfile.txt'; }
    const p1 = ServerClient.request(req, 'ReadFileResponse')
    .then((response) => {
      const expected = new Response.ReadFileResponse();
      { expected.content = 'tfile contents \n\nasdf'; }
      assert.serializedEqual(response, expected, 'When sending correct request, received correct ReadFileResponse.');
    });

    { req.filePath = 'test/static/nonexistantTestFile.txt'; }
    const p2 = ServerClient.request(req, 'ReadFileResponse')
    .catch((response) => {
      const expected = new Response.ErrorResponse();
      { expected.message = 'Error reading file: test/static/nonexistantTestFile.txt'; }
      assert.serializedEqual(response, expected, 'When sending request for nonexisting directory, received correct ErrorResponse.');
    });

    Promise.all([ p1, p2 ]).then(asyncDone).catch(asyncDone);
  });

  Test.testAsync('Integration Filesystem WriteFileRequest-ReadFileRequest', function(assert, asyncDone) {
    const req = new Request.WriteFileRequest();
    { req.filePath = 'test/testWriteFile.txt';
      req.content = 'asdf\n \n'+Math.random(); }
    const p1 = ServerClient.request(req, 'WriteFileResponse')
    .then((response) => {
      const expected = new Response.WriteFileResponse();
      assert.serializedEqual(response, expected, 'When sending correct request, received correct WriteFileResponse.');

      const req2 = new Request.ReadFileRequest();
      { req2.filePath = req.filePath; }
      return ServerClient.request(req2, 'ReadFileResponse')
    })
    .then((response) => {
      const expected = new Response.ReadFileResponse();
      { expected.content = req.content; }
      assert.serializedEqual(response, expected, 'When sending correct request, received correct ReadFileResponse.');
    });

    Promise.all([ p1 ]).then(asyncDone).catch(asyncDone);
  });
}