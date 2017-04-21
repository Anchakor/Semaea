
export type Request = ListDirectoryRequest | UnrecognizedRequest

export class ListDirectoryRequest {
  kind: "ListDirectoryRequest" = "ListDirectoryRequest"
  dirPath: string
}

export class UnrecognizedRequest {
  kind: "UnrecognizedRequest" = "UnrecognizedRequest"
}
