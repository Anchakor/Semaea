import { IDirectoryEntry } from 'Server/Filesystem';

export type Response = ErrorResponse | ListDirectoryResponse

export class ErrorResponse {
  kind: "ErrorResponse" = "ErrorResponse"
  message: string
}

export class ListDirectoryResponse {
  kind: "ListDirectoryResponse" = "ListDirectoryResponse"
  listing: IDirectoryEntry[]
}