import { Chord, Mode, ChordType, distance, note } from "@tonaljs/tonal";
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
  let chordObj = Chord.getChord(chord.type, chord.root);
  if (chordObj.empty) {
    chordObj = Chord.getChord("", chord.root);
  }
  const invert =
    chord.inversion >= 0 && chord.inversion < chordObj.notes.length
      ? chord.inversion
      : 0;
  const real = Chord.getChord(
    chordObj.aliases[0],
    chordObj.tonic as any,
    chordObj.notes[invert]
  );
  if (real.empty) {
    console.log(chord, chordObj, real);
    throw new Error("Could not convert ChordInfo into Tonal: ChordObject");
  }
  return real;
}

export class To {
  static Notes(chord: ChordInfo): PitchClass[];
  static Notes(chord: ChordInfo, octave: Octave): Pitch[];
  static Notes(chord: ChordInfo, octave?: Octave): Pitch[] | PitchClass[] {
    let failed = false;
    let notes = [];
    if (isOctave(octave)) {
      const tonic = chord.root + octave;
      const chordObj = _toChordObj({
        root: tonic as any,
        type: chord.type,
        inversion: chord.inversion,
      });
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
      throw new Error("Failed to convert ChordInfo to notes");
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
    const real = Chord.getChord(c.aliases[0], c.tonic as any, p[1]);
    if (!real.empty) {
      return {
        root: real.tonic as any,
        type: real.aliases[0],
        inversion: real.rootDegree ? real.rootDegree - 1 : 0,
      };
    }
    return undefined;
  }
}

// const struct = {
//   num: 2,
//   keySig: {
//     tonic: "C#",
//     mode: "dorian"
//   }
// };
// const chordNum = struct.num - 1;
// const triad = Mode.triads(struct.keySig.mode, struct.keySig.tonic)[chordNum];
// const seven = Mode.seventhChords(struct.keySig.mode, struct.keySig.tonic)[
//   chordNum
// ];
// const eleven = Chord.extended(seven)[0];
// console.log(triad, seven, eleven);
// console.log(Chord.getChord("m7add11", "F#", "E").tonic);
