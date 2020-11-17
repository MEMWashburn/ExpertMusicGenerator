import { BitString } from "./BitString";
import { expect } from "chai";

describe("BitString", () => {
  it("should be instantiable", () => {
    const bitstring = new BitString();
    expect(bitstring).to.exist;
  });

  it("should produce strings", () => {
    const bitstring = new BitString();
    bitstring.addBit(1);
    expect(bitstring.toString()).to.eql("1");
    bitstring.addBit(0);
    expect(bitstring.toString()).to.eql("10");
    expect(new BitString("010101").toString()).to.eql("010101");
  });

  it("should be convertible to byte array", () => {
    expect(new BitString("10000000").toByteArray()[0]).to.eql(128);
    const bitstring = new BitString();
    bitstring.addBit(1);
    bitstring.addBit(0);
    expect(bitstring.toByteArray()[0]).to.eql(2);
    expect(new BitString("100000001").toByteArray()[1]).to.eql(1);
    expect(new BitString("100000001").toByteArray()[0]).to.eql(128);
  });

  it("should be mutable", () => {
    const bitstring = new BitString("111");
    bitstring.mutate(1.0);
    expect(bitstring.toString()).to.eql("000");
    bitstring.mutate(0);
    expect(bitstring.toString()).to.eql("000");
  });

  it("should only be mutable by valid probabilities", () => {
    const bitstring = new BitString("10");
    bitstring.mutate(1.0);
    bitstring.mutate(0);
    bitstring.mutate(0.5);
    expect(() => bitstring.mutate(1.00000001)).to.throw(
      Error,
      "Mutation chance is not a valid probability"
    );
    expect(() => bitstring.mutate(-0.00000001)).to.throw(
      Error,
      "Mutation chance is not a valid probability"
    );
  });

  it("should be mutable parents of different length", () => {
    const parentA = new BitString("010");
    const parentB = new BitString("101");
    const children = new BitString("10").crossover(parentA);
    expect(children[1].toString().length).to.eql(parentA.toString().length);
    expect(() => parentA.crossover(parentB, 4)).to.throw(
      Error,
      "Invalid number of crossover points"
    );
    expect(() => parentA.crossover(parentB, 0)).to.throw(
      Error,
      "Invalid number of crossover points"
    );
  });
});
