import { Log, checkKindFor } from '../Common';
import { IDirectoryEntry } from '../Entities/Filesystem';

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

type ResponseTypes = Response
  | ErrorResponse
  | ListDirectoryResponse
  | ReadFileResponse
  | WriteFileResponse

export interface Response {
  readonly kind: ResponseKind
}

export const responseIsOfKind = checkKindFor<ResponseTypes>();

export enum ResponseKind { ErrorResponse = 'ErrorResponse' }
export class ErrorResponse implements Response {
  readonly kind = ResponseKind.ErrorResponse
  message: string = ''
}

export enum ResponseKind { ListDirectoryResponse = 'ListDirectoryResponse' }
export class ListDirectoryResponse implements Response {
  readonly kind = ResponseKind.ListDirectoryResponse
  listing: IDirectoryEntry[] = []
}

export enum ResponseKind { ReadFileResponse = 'ReadFileResponse' }
export class ReadFileResponse implements Response {
  readonly kind = ResponseKind.ReadFileResponse
  content: string = ''
}

export enum ResponseKind { WriteFileResponse = 'WriteFileResponse' }
export class WriteFileResponse implements Response {
  readonly kind = ResponseKind.WriteFileResponse
}