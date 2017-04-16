
import { IDeserializeObject } from "Serialization/IDeserializeObject";
import { IConstructable } from "Common";

export function serialize(input: any): string {
  return JSON.stringify(input);
}

/** use: deserialize(Class.deserializeObject, inputString);
 * where deserializeObject is static method implementing IDeserializeObject<Class> */
export function deserialize<T>(deserializeObjectFunc: IDeserializeObject<T>, input: string): T | undefined {
  try {
    return deserializeObject(deserializeObjectFunc, JSON.parse(input));
  } catch(ex) {
    return undefined;
  }
}

/** use: deserialize(Class.deserializeObject, inputObject);
 * where deserializeObject is static method implementing IDeserializeObject<Class> */
export function deserializeObject<T>(deserializeObjectFunc: IDeserializeObject<T>, input: Object): T | undefined {
  try {
    return deserializeObjectFunc(input);
  } catch(ex) {
    return undefined;
  }
}
