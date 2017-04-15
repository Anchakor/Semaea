
export interface ISerializable<T> {
  deserializeObject(input: {}): void;
}