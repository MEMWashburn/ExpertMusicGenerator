/**
 * helper function to convert a base64 encoded string back to a Uint8Array
 * used in reading midi data
 * @param enc base64 string
 * @returns unsigned byte array
 */
export function base64ToUInt8Array(enc: string): Uint8Array {
  if (typeof atob === "function") {
    return Uint8Array.from([...atob(enc)].map(c => c.charCodeAt(0)));
  }
  return Uint8Array.from([...Buffer.from(enc, "base64").toString("ascii")].map(c => c.charCodeAt(0)));
}
