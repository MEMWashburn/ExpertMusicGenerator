import * as cp from "./pitch";
import { expect } from "chai";

describe("Convert.Pitch", () => {
  it("To.String", () => {
    expect(cp.To.String({class: "A#", octave: -1})).to.eql("A#-1");
    expect(cp.To.String({class: "Db", octave: 0})).to.eql("Db0");
    expect(cp.To.String({class: "G", octave: 5})).to.eql("G5");
  });
  it("From.String", () => {
    expect(cp.From.String("A#-1")).to.eql({class: "A#", octave: -1});
    expect(cp.From.String("Db0")).to.eql({class: "Db", octave: 0});

    expect(cp.From.String("Gb")).to.eql({class: "Gb", octave: 0});

    expect(cp.From.String("")).to.eql(undefined);
  });
});
