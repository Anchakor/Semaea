declare module 'cbor-js' {
  function encode(input: any): ArrayBuffer;
  function decode(data: ArrayBuffer, tagger?: (value: any, length: number) => any, simpleValue?: () => any): any
}