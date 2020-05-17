import { NoteDuration } from "./duration";
import { expect } from "chai";

describe("NoteDuration", () => {
  it("have correct fractions", () => {
    expect(NoteDuration.Whole.getFraction()).to.eql([1, 1]);
  });
});
