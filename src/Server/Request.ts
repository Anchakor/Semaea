
export interface Request {
  readonly kind: RequestKind
}

export function requestIsOfKind<R extends Request>(request: Request, requestKind: RequestKind): request is R {
  return (request.kind == requestKind);
}

export enum RequestKind { UnrecognizedRequest = 'UnrecognizedRequest' }
export class UnrecognizedRequest implements Request {
  readonly kind = RequestKind.UnrecognizedRequest
}

export enum RequestKind { ListDirectoryRequest = 'ListDirectoryRequest' }
export class ListDirectoryRequest implements Request {
  readonly kind = RequestKind.ListDirectoryRequest
  dirPath: string = ''
}

export enum RequestKind { ReadFileRequest = 'ReadFileRequest' }
export class ReadFileRequest implements Request {
  readonly kind = RequestKind.ReadFileRequest
  filePath: string = ''
}

export enum RequestKind { WriteFileRequest = 'WriteFileRequest' }
export class WriteFileRequest implements Request {
  readonly kind = RequestKind.WriteFileRequest
  filePath: string = ''
  content: string = ''
}


