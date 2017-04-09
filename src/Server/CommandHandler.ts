
export function handle(commandString: string): string | undefined {
  try {
    console.log("handling command: "+commandString);
    const command = JSON.parse(commandString);
    return JSON.stringify({ message: "test command response", command: command });
  } catch (ex) {
    return "";
  }
}