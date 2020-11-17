import * as cc from "./chord";
import { expect } from "chai";

describe("Convert.Chord", () => {
  it("To.String", () => {
    expect(cc.To.String({ tonic: "A#", type: "maj7", inversion: 0 })).to.eql(
      "A#maj7"
    );
    expect(cc.To.String({ tonic: "C", type: "maj7", inversion: 1 })).to.eql(
      "Cmaj7/E"
    );
    expect(cc.To.String({ tonic: "C", type: "maj7", inversion: 2 })).to.eql(
      "Cmaj7/G"
    );

    // weird:
    expect(cc.To.String({ tonic: "A#", type: "maj7sdf", inversion: 0 })).to.eql(
      "A#M"
    );
  });

  it("To.Notes", () => {
    // expect(cc.To.Notes("A#maj7")).to.eql();
  });

  it("From.String", () => {
    expect(cc.From.String("A#maj7")).to.eql({
      tonic: "A#",
      type: "maj7",
      inversion: 0,
    });
    expect(cc.From.String("D#m7add11")).to.eql({
      tonic: "D#",
      type: "m7add11",
      inversion: 0,
    });
  });
});
