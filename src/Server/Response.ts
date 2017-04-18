import { IDirectoryEntry } from 'Server/Filesystem';

export function createErrorResponse(err: any) {
  const r = new ErrorResponse();
  if (err) {
    if (typeof err === "string") {
      r.message = err
    } else if (typeof err === "object") {
      r.message = JSON.stringify(err);
    }
  }
  return r;
}

export type Response = ErrorResponse | ListDirectoryResponse
export type ResponseKind = "ErrorResponse" | "ListDirectoryResponse"

export class ErrorResponse {
  kind: "ErrorResponse" = "ErrorResponse"
  message: string
}

export class ListDirectoryResponse {
  kind: "ListDirectoryResponse" = "ListDirectoryResponse"
  listing: IDirectoryEntry[]
}