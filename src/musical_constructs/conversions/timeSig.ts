import { NoteDuration } from "../duration";
import { TimeSignature } from "../types";

export class To {
  /**
   * returns the duration of a measure in the specified time signature
   * @param timeSig Time Signature
   */
  static measureLength(timeSig: TimeSignature): NoteDuration {
    let beat = NoteDuration.fromFraction([1, timeSig.denominator]);
    beat = beat ? beat : NoteDuration.Quarter;

    let sum = NoteDuration.Zero;
    for (let i = 0; i < timeSig.numerator; i++) {
      const res = sum.add(beat);
      if (!res) {
        break;
      } else {
        sum = res;
      }
    }
    return sum;
  }
}
