import * as Response from 'Server/Response';
import { Command, ListDirectoryCommand } from './Command';
import { listDirectory } from "Server/Filesystem";

export function handle(commandString: string): Promise<string> {
  try {
    console.log("handling command: "+commandString);
    const command = JSON.parse(commandString) as Command;
    return handleCommand(command);
  } catch (ex) {
    return Promise.resolve(prepareErrorResponse(ex));
  }
}

function handleCommand(command: Command) {
  switch (command.kind) {
    case "ListDirectoryCommand":
      return listDirectory(command.dirPath).then((listing) => {
        const r = new Response.ListDirectoryResponse();
        r.listing = listing
        return prepareResponse(r);
      });
    default:
      return Promise.resolve(prepareErrorResponse("CommandHandler: Unrecognized command."));
  }
}

export function prepareErrorResponse(err: any) {
  const r = new Response.ErrorResponse();
  if (err) {
    if (typeof err === "string") {
      r.message = err
    } else if (typeof err === "object") {
      r.message = JSON.stringify(err);
    }
  }
  return JSON.stringify(r);
}

function prepareResponse(response: Object) {
  return JSON.stringify(response);
}
