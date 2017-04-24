
export type Request = UnrecognizedRequest | FilesystemRequest

export class UnrecognizedRequest {
  kind: "UnrecognizedRequest" = "UnrecognizedRequest"
}

export type FilesystemRequest = ListDirectoryRequest | ReadFileRequest

export class ListDirectoryRequest {
  kind: "ListDirectoryRequest" = "ListDirectoryRequest"
  dirPath: string
}

export class ReadFileRequest {
  kind: "ReadFileRequest" = "ReadFileRequest"
  filePath: string
}


