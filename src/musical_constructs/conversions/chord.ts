import { Chord, Note } from "@tonaljs/tonal";
import {
  Pitch,
  Octave,
  isPitchClass,
  isOctave,
  ChordInfo,
  PitchClass,
} from "../types";
import * as convertPitch from "./pitch";

function _toChordObj(chord: ChordInfo) {
  let chordObj = Chord.getChord(chord.type, chord.tonic);
  if (chordObj.empty) {
    chordObj = Chord.getChord("triad", chord.tonic);
  }
  const invert =
    chord.inversion >= 0 && chord.inversion < chordObj.notes.length
      ? chord.inversion
      : 0;
  const real = Chord.getChord(
    chordObj.type,
    chordObj.tonic as any,
    chordObj.notes[invert]
  );
  return real;
}

export class To {
  static Notes(chord: ChordInfo): PitchClass[];
  static Notes(chord: ChordInfo, octave: Octave): Pitch[];
  static Notes(chord: ChordInfo, octave?: Octave): Pitch[] | PitchClass[] {
    let failed = false;
    let notes = [];
    if (isOctave(octave)) {
      chord.tonic += "" + octave;
      const chordObj = _toChordObj(chord);
      notes = chordObj.notes.map((n) => {
        const p = convertPitch.From.String(n);
        failed = failed || p === undefined;
        return p;
      });
    } else {
      const chordObj = _toChordObj(chord);
      notes = chordObj.notes.map((n) => {
        failed = failed || !isPitchClass(n);
        return n;
      });
    }

    if (failed) {
      throw new Error("Failed to convert chord info to notes");
    }
    return notes as any;
  }

  /**
   * converts ChordInfo to string
   * @param chord musical construct ChordInfo
   */
  static String(chord: ChordInfo): string {
    const chordObj = _toChordObj(chord);
    return chordObj.symbol;
  }
}

export class From {
  /**
   * converts string to musical construct: ChordInfo
   * @param chordSymbol tonal chord symbol
   */
  static String(chordSymbol: string): ChordInfo | undefined {
    const p = chordSymbol.trim().split("/");
    const c = Chord.get(p[0]);
    const real = Chord.getChord(c.type, c.tonic as any, p[1]);
    if (!real.empty) {
      return {
        tonic: real.tonic as any,
        type: real.aliases[0],
        inversion: real.rootDegree ? real.rootDegree - 1 : 0,
      };
    }
    return undefined;
  }
}
