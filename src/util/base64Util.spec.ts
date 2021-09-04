import { base64ToUInt8Array } from "./base64Util";
import { expect } from "chai";


describe("base64ToUInt8Array", () => {
  it("convert string back to UInt8Array", () => {
    const expected = new Uint8Array(3);
    expected[0] = 5;
    expected[1] = 3;
    expected[2] = 27;
    const enc = Buffer.from(expected as any).toString("base64");
    expect(base64ToUInt8Array(enc)).deep.equal(expected);
  });
});
