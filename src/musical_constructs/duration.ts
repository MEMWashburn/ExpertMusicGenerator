import { EnumLiteralsOf } from "./types";
import { math as m } from "../util";

// Note Duration Classes
// base types of note durations
export type DurationClass = EnumLiteralsOf<typeof DurationClass>;
export const DurationClass = Object.freeze({
  whole: "whole" as "whole",
  half: "half" as "half",
  quarter: "quarter" as "quarter",
  eighth: "eighth" as "eighth",
  sixteenth: "sixteenth" as "sixteenth",
  thirtySecond: "thirtySecond" as "thirtySecond",
  sixtyFourth: "sixtyFourth" as "sixtyFourth",
  hundredTwentyEighth: "hundredTwentyEighth" as "hundredTwentyEighth",
});

const fractionMap = new Map<DurationClass, [number, number]>();
fractionMap.set(DurationClass.whole, [1, 1]);
fractionMap.set(DurationClass.half, [1, 2]);
fractionMap.set(DurationClass.quarter, [1, 4]);
fractionMap.set(DurationClass.eighth, [1, 8]);
fractionMap.set(DurationClass.sixteenth, [1, 16]);
fractionMap.set(DurationClass.thirtySecond, [1, 32]);
fractionMap.set(DurationClass.sixtyFourth, [1, 64]);

// Takes denominator -> Duration class
const durationClassMap = new Map<number, DurationClass>();
durationClassMap.set(1, DurationClass.whole);
durationClassMap.set(2, DurationClass.half);
durationClassMap.set(4, DurationClass.quarter);
durationClassMap.set(8, DurationClass.eighth);
durationClassMap.set(16, DurationClass.sixteenth);
durationClassMap.set(32, DurationClass.thirtySecond);
durationClassMap.set(64, DurationClass.sixtyFourth);

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
  // Useful for arithmetic
  static get Zero() {
    return new NoteDuration(DurationClass.whole, false, 0, 0);
  }

  /**
   * Duration class: Whole, half, eighth, etc.
   */
  durationClass: DurationClass;
  /**
   * is this duration a triplet?
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

  //TODO: this does not work for everything
  static fromFraction(frac: [number, number]): NoteDuration | undefined {
    const durClass = durationClassMap.get(frac[1]);
    if (durClass) {
      return new NoteDuration(durClass, false, 0, frac[0]);
    } else {
      return undefined;
    }
  }

  static add(
    a: NoteDuration,
    b: NoteDuration,
    ...notes: NoteDuration[]
  ): NoteDuration | undefined {
    if (!a && !b) {
      return undefined;
    } else if (!b) {
      return a;
    }
    const aF = a.getFraction();
    const bF = b.getFraction();
    const sum = m.reduce([aF[0] * bF[1] + bF[0] * aF[1], aF[1] * bF[1]]);
    const dur = NoteDuration.fromFraction(sum);
    if (dur) {
      return NoteDuration.add(dur, notes[0], ...(notes.slice(1)));
    }
    return undefined;
  }

  static minus(
    a: NoteDuration,
    b: NoteDuration,
    ...notes: NoteDuration[]
  ): NoteDuration | undefined {
    if (!a && !b) {
      return undefined;
    } else if (!b) {
      return a;
    }
    const aF = a.getFraction();
    const bF = b.getFraction();
    const sum = m.reduce([aF[0] * bF[1] - bF[0] * aF[1], aF[1] * bF[1]]);
    const durClass = durationClassMap.get(sum[1]);
    const dur = NoteDuration.fromFraction(sum);
    if (dur) {
      return NoteDuration.minus(dur, notes[0], ...(notes.slice(1)));
    }
    return undefined;
  }

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

  add(
    a: NoteDuration,
    ...notes: NoteDuration[]
  ): NoteDuration | undefined {
    return NoteDuration.add(this, a, ...notes);
  }

  minus(
    a: NoteDuration,
    ...notes: NoteDuration[]
  ): NoteDuration | undefined {
    return NoteDuration.minus(this, a, ...notes);
  }

  getFraction(withoutMultplier = false): [number, number] {
    let frac = fractionMap.get(this.durationClass);
    if (!frac) {
      // defaults to whole note
      return [1, 1];
    } else {
      // copy fraction from map
      frac = [...frac];
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
