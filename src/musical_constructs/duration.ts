import { EnumLiteralsOf } from "./types";

// Note Duration Classes
// base types of note durations
export type DurationClass = EnumLiteralsOf<typeof DurationClass>;
export const DurationClass = Object.freeze({
  whole: "whole" as "whole",
  half: "half" as "half" ,
  quarter: "quarter" as "quarter" ,
  eighth: "eighth" as "eighth" ,
  sixteenth: "sixteenth" as "sixteenth" ,
  thirtySecond: "thirtySecond" as "thirtySecond" ,
  sixtyFourth: "sixtyFourth" as "sixtyFourth" ,
  hundredTwentyEighth: "hundredTwentyEighth" as "hundredTwentyEighth"
});

const fractionMap = new Map<DurationClass, [number, number]>();
fractionMap.set(DurationClass.whole, [1, 1]);
fractionMap.set(DurationClass.half, [1, 2]);
fractionMap.set(DurationClass.quarter, [1, 4]);
fractionMap.set(DurationClass.eighth, [1, 8]);
fractionMap.set(DurationClass.sixteenth, [1, 16]);
fractionMap.set(DurationClass.thirtySecond, [1, 32]);
fractionMap.set(DurationClass.sixtyFourth, [1, 64]);

/**
 * Encapsulates note durations and allows the manipulation
 * and combination of the note durations.
 */
export class NoteDuration {
  // common note durations:
  static get Whole() {
    return new NoteDuration(DurationClass.whole);
  }
  static get DottedWhole() {
    return new NoteDuration(DurationClass.whole, false, 1);
  }
  static get DoubleDottedWhole() {
    return new NoteDuration(DurationClass.whole, false, 2);
  }
  static get Half() {
    return new NoteDuration(DurationClass.half);
  }
  static get DottedHalf() {
    return new NoteDuration(DurationClass.half, false, 1);
  }
  static get DoubleDottedHalf() {
    return new NoteDuration(DurationClass.half, false, 2);
  }
  static get Quarter() {
    return new NoteDuration(DurationClass.quarter);
  }
  static get QuarterTriplet() {
    return new NoteDuration(DurationClass.quarter, true);
  }
  static get DottedQuarter() {
    return new NoteDuration(DurationClass.quarter, false, 1);
  }
  static get DoubleDottedQuarter() {
    return new NoteDuration(DurationClass.quarter, false, 2);
  }
  static get Eighth() {
    return new NoteDuration(DurationClass.eighth);
  }
  static get EighthTriplet() {
    return new NoteDuration(DurationClass.eighth, true);
  }
  static get DottedEighth() {
    return new NoteDuration(DurationClass.eighth, false, 1);
  }
  static get DoubleDottedEighth() {
    return new NoteDuration(DurationClass.eighth, false, 2);
  }
  static get Sixteenth() {
    return new NoteDuration(DurationClass.sixteenth);
  }
  static get SixteenthTriplet() {
    return new NoteDuration(DurationClass.sixteenth, true);
  }
  static get DottedSixteenth() {
    return new NoteDuration(DurationClass.sixteenth, false, 1);
  }
  static get DoubleDottedSixteenth() {
    return new NoteDuration(DurationClass.sixteenth, false, 2);
  }
  static get ThirtySecond() {
    return new NoteDuration(DurationClass.thirtySecond);
  }

  /**
     * Duration class: Whole, half, eighth, etc.
     */
    durationClass: DurationClass;
    /**
     * is this duration actually a triplet?
     */
    isTriplet = false;
    /**
     * is this class a dotted, double dotted, triple dotted?
     */
    dots: 0 | 1 | 2 | 3 = 0;
    /**
     * durationClass can include a multiplier to be succinct
     * for example a NoteDuration with durationClass.whole and multiplier 5
     * would represent a duration of 5 whole notes (20 quarter notes), etc.
     * will be rounded to nearest whole number
     */
    multiplier = 1;

  constructor(
    durClass: DurationClass,
    isTriplet: boolean = false,
    dots: 0 | 1 | 2 | 3 = 0,
    multiplier: number = 1
  ) {
    this.durationClass = durClass;
    this.isTriplet = isTriplet;
    this.dots = dots;
    this.multiplier = Math.round(multiplier);
  }

  getFraction(withoutMultplier = false): [number, number] {
    const frac = fractionMap.get(this.durationClass);
    if (!frac) {
      // defaults to whole note
      return [1, 1];
    }

    if (this.isTriplet) {
      frac[1] = frac[1] * 3;
    }

    for (let d = 0; d < this.dots; d++) {
      frac[0] = frac[0] * 2 + 1;
      frac[1] = frac[1] * 2;
    }

    if (!withoutMultplier) {
      frac[0] = frac[0] * this.multiplier;
    }

    return frac;
  }

  getValue(withoutMultplier = false): number {
    const frac = this.getFraction(withoutMultplier);
    return frac[0] / frac[1];
  }

}
