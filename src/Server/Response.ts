import { IDirectoryEntry } from '../Server/Filesystem';

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

export type Response =      ErrorResponse |   FilesystemResponse
export type ResponseKind =  'ErrorResponse' | FilesystemResponseKind

export class ErrorResponse {
  kind: 'ErrorResponse' = 'ErrorResponse'
  message: string = ''
}

export type FilesystemResponse =      ListDirectoryResponse |   ReadFileResponse |    WriteFileResponse
export type FilesystemResponseKind =  'ListDirectoryResponse' | 'ReadFileResponse' |  'WriteFileResponse'

export class ListDirectoryResponse {
  kind: 'ListDirectoryResponse' = 'ListDirectoryResponse'
  listing: IDirectoryEntry[] = []
}

export class ReadFileResponse {
  kind: 'ReadFileResponse' = 'ReadFileResponse'
  content: string = ''
}

export class WriteFileResponse {
  kind: 'WriteFileResponse' = 'WriteFileResponse'
}