import { NoteDuration } from "./duration";

// Used to help create more JS friendly enums
export type EnumLiteralsOf<T extends object> = T[keyof T];
// Helper for custom numerical types that are a subset of all numbers
const numLitArray = <N extends number>(arr: N[]) => arr;
// Helper for custom string types that are a subset of all strings
const stringLitArray = <L extends string>(arr: L[]) => arr;

// Pitch Class
// contains the 12 unique pitches
export type PitchClass = EnumLiteralsOf<typeof PitchClass>;
export const PitchClass = Object.freeze({
  A: "A" as "A",
  Ab: "Ab" as "Ab",
  B: "B" as "B",
  Bb: "Bb" as "Bb",
  C: "C" as "C",
  D: "D" as "D",
  Db: "Db" as "Db",
  E: "E" as "E",
  Eb: "Eb" as "Eb",
  F: "F" as "F",
  G: "G" as "G",
  Gb: "Gb" as "Gb",
});

// Allowed Octaves
const octaves = numLitArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
export type Octave = (typeof octaves)[number];
// typecheck
export const isOctave = (x: any): x is Octave => octaves.indexOf(x) !== -1;

// Modes
export type ChurchModes = EnumLiteralsOf<typeof ChurchModes>;
export const ChurchModes = Object.freeze({
  /** (intervals: Whole - Whole - Half - Whole - Whole - Whole - Half) */
  Ionian: "ionian" as "ionian",

  /** (intervals: Whole - Half - Whole - Whole - Whole - Half - Whole) */
  Dorian: "dorian" as "dorian",

  /** (intervals: Half - Whole - Whole - Whole - Half - Whole - Whole) */
  Phrygian: "phrygian" as "phrygian",

  /** (intervals: Whole - Whole - Whole - Half - Whole - Whole - Half) */
  Lydian: "lydian" as "lydian",

  /** (intervals: Whole - Half - Whole - Whole - Whole - Half - Whole) */
  Mixolydian: "mixolydian" as "mixolydian",

  /** (intervals: Whole - Half - Whole - Whole - Half - Whole - Whole) */
  Aeolian: "aeolian" as "aeolian",

  /** (intervals: Half - Whole - Whole - Half - Whole - Whole - Whole) */
  Locrian: "locrian" as "locrian",
});

export type MoreModes = EnumLiteralsOf<typeof MoreModes>;
export const MoreModes = Object.freeze({
  /** more modes */
  OtherMode: "other" as "other"
});

export type Mode = ChurchModes | MoreModes;
export const Mode = {...ChurchModes, ...MoreModes};

/** A chord, in music, is any harmonic set of pitches consisting of multiple notes (also called "pitches")
 * that are heard as if sounding simultaneously. */
export type ChordType = EnumLiteralsOf<typeof ChordType>;
export const ChordType = Object.freeze({
  Triad: "triad" as "triad",
  Seven: "seven" as "seven",
  Nine: "nine" as "nine",
  Eleven: "eleven" as "eleven",
  Thirteen: "thirteen" as "thirteen"
});

export interface Pitch {
  class: PitchClass;
  octave: Octave;
}

export interface Mark {
  pitch: Pitch | Pitch[];
  duration: NoteDuration;
}

// let temp: number;
// temp = Math.random() > 0.5 ? 1 : 23;
// let myOctave: Octave;
// if (isOctave(temp)) {
//   myOctave = temp;
// }
