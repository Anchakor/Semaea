import { IDirectoryEntry } from '../Server/Filesystem';
import { Log } from '../Common';

export function createErrorResponse(err: any) {
  const r = new ErrorResponse();
  if (err) {
    if (typeof err === 'string') {
      r.message = err
    } else if (typeof err === 'object') {
      if (JSON.stringify(err) !== '{}') r.message = JSON.stringify(err);
      else r.message = err.toString();
    }
  }
  return r;
}

export function handleUnexpectedResponse(response: Response) {
  Log.error("Received unexpected response: "+JSON.stringify(response));
}

export interface Response {
  kind: ResponseKind
}

export function responseIsOfKind<R extends Response>(response: Response, responseKind: ResponseKind): response is R {
  return (response.kind == responseKind);
}

export enum ResponseKind { ErrorResponse = 'ErrorResponse' }
export class ErrorResponse implements Response {
  kind: ResponseKind.ErrorResponse = ResponseKind.ErrorResponse
  message: string = ''
}

export enum ResponseKind { ListDirectoryResponse = 'ListDirectoryResponse' }
export class ListDirectoryResponse implements Response {
  kind: ResponseKind.ListDirectoryResponse = ResponseKind.ListDirectoryResponse
  listing: IDirectoryEntry[] = []
}

export enum ResponseKind { ReadFileResponse = 'ReadFileResponse' }
export class ReadFileResponse implements Response {
  kind: ResponseKind.ReadFileResponse = ResponseKind.ReadFileResponse
  content: string = ''
}

export enum ResponseKind { WriteFileResponse = 'WriteFileResponse' }
export class WriteFileResponse implements Response {
  kind: ResponseKind.WriteFileResponse = ResponseKind.WriteFileResponse
}