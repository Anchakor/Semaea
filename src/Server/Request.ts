import { checkKindFor } from '../Common';

type RequestTypes = Request 
  | UnrecognizedRequest
  | ListDirectoryRequest
  | ReadFileRequest
  | WriteFileRequest

export interface Request {
  readonly kind: RequestKind
}

export const requestIsOfKind = checkKindFor<RequestTypes>();

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


