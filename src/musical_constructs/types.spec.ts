import { expect } from "chai";
import { isOctave } from ".";
import {PitchClass, isPitchClass} from "./types";

describe("isPitchClass type check", () => {
    // Valid
    Object.values(PitchClass).forEach(pc => {
        it(`"${pc}" is valid PitchClass`, () => {
            expect(isPitchClass(pc)).true;
        });
    });
    // invalid
    ["", "b", "z", "word"].forEach(str => {
        it(`"${str}" is not valid PitchClass`, () => {
            expect(isPitchClass(str)).false;
        });
    });
  });

describe("isOctave type check", () => {
    // valid
    for (let i = -1; i <= 8; ++i) {
        it(`${i} is a valid Octave`, () => {
            expect(isOctave(i)).true;
        });
    }
    // invalid
    [0.5, -2, 99, 0.0001].forEach(num => {
        it(`${num} is not a valid Octave`, () => {
            expect(isOctave(num)).false;
        });
    });
});
