
export interface Request {
  kind: RequestKind
}

export function requestIsOfKind<R extends Request>(request: Request, requestKind: RequestKind): request is R {
  return (request.kind == requestKind);
}

export enum RequestKind { UnrecognizedRequest = 'UnrecognizedRequest' }
export class UnrecognizedRequest implements Request {
  kind: RequestKind.UnrecognizedRequest = RequestKind.UnrecognizedRequest
}

export enum RequestKind { ListDirectoryRequest = 'ListDirectoryRequest' }
export class ListDirectoryRequest implements Request {
  kind: RequestKind.ListDirectoryRequest = RequestKind.ListDirectoryRequest
  dirPath: string = ''
}

export enum RequestKind { ReadFileRequest = 'ReadFileRequest' }
export class ReadFileRequest implements Request {
  kind: RequestKind.ReadFileRequest = RequestKind.ReadFileRequest
  filePath: string = ''
}

export enum RequestKind { WriteFileRequest = 'WriteFileRequest' }
export class WriteFileRequest implements Request {
  kind: RequestKind.WriteFileRequest = RequestKind.WriteFileRequest
  filePath: string = ''
  content: string = ''
}


