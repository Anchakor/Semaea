
export type Command = ListDirectoryCommand | Command2

export class ListDirectoryCommand {
  kind: "ListDirectoryCommand" = "ListDirectoryCommand"
  dirPath: string
}

export class Command2 {
  kind: "command2" = "command2"
}
