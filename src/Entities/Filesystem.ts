

export enum DirectoryEntryKind {
  File = 'File',
  Directory = 'Directory',
}

export interface IDirectoryEntry {
  kind: DirectoryEntryKind
  name: string
}

export enum FilesystemPredicates {
  DirectoryEntryKind = 'type',
}