import { Note } from "@tonaljs/tonal";
import { Pitch, isPitchClass, isOctave } from "../types";

export class To {
  /**
   * converts Pitch to string
   * @param pitch musical construct Pitch
   */
  static String(pitch: Pitch): string {
    return Note.name(pitch.class + pitch.octave);
  }
}

export class From {
  /**
   * converts string to musical construct: Pitch
   * @param pitch tonal string representation of pitch
   */
  static String(pitch: string): Pitch | undefined {
    const n = Note.name(pitch);
    if (n) {
      const match = n.match(/[A-z#]+/gi);
      if (match) {
        const pc = match[0];
        const oct = parseInt(n.replace(pc, ""), 10);
        if (isPitchClass(pc)) {
          return {
            class: pc,
            octave: isOctave(oct) ? oct : 0,
          };
        }
      }
    }
    return undefined;
  }
}
