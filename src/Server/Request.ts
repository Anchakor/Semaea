
export type Request = ListDirectoryRequest | Request2

export class ListDirectoryRequest {
  kind: "ListDirectoryRequest" = "ListDirectoryRequest"
  dirPath: string
}

export class Request2 {
  kind: "Request2" = "Request2"
}
