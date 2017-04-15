
import { ISerializable } from "Serialization/ISerializable";
import { IConstructable } from "Common";

export function serialize(input: any): string {
  return JSON.stringify(input);
}

// use: deserialize(Class, inputString);
export function deserialize<T extends ISerializable<T>>(ctor: IConstructable<T>, input: string): T | undefined {
  try {
    return deserializeObject(ctor, JSON.parse(input));
  } catch(ex) {
    return undefined;
  }
}

// use: deserialize(Class, inputObject);
export function deserializeObject<T extends ISerializable<T>>(ctor: IConstructable<T>, input: Object): T | undefined {
  try {
    const i = new ctor();
    i.deserializeObject(input);
    return i;
  } catch(ex) {
    return undefined;
  }
}
