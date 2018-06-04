declare module 'cbor-js' {
  /** Encode the input. The input cannot contain ArrayBuffers, use Uint8Array instead. */
  function encode(input: any): ArrayBuffer;
  
  /** Decode the entire ArrayBuffer `data`. */
  function decode(data: ArrayBuffer, tagger?: (value: any, length: number) => any, simpleValue?: () => any): any
}