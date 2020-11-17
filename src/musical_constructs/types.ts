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
  C: "C" as "C",
  Cs: "C#" as "C#",
  Db: "Db" as "Db",
  D: "D" as "D",
  Ds: "D#" as "D#",
  Eb: "Eb" as "Eb",
  E: "E" as "E",
  F: "F" as "F",
  Fs: "F#" as "F#",
  Gb: "Gb" as "Gb",
  G: "G" as "G",
  Gs: "G#" as "G#",
  Ab: "Ab" as "Ab",
  A: "A" as "A",
  As: "A#" as "A#",
  Bb: "Bb" as "Bb",
  B: "B" as "B",
});
const ALL_PITCHCLASS: string[] = Object.keys(PitchClass).map(
  (k) => (PitchClass as any)[k]
);
// typecheck
export const isPitchClass = (p: string): p is PitchClass =>
  ALL_PITCHCLASS.indexOf(p) !== -1;

// Allowed Octaves
const octaves = numLitArray([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
export type Octave = typeof octaves[number];
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
  OtherMode: "other" as "other",
});

export type Mode = ChurchModes | MoreModes;
export const Mode = { ...ChurchModes, ...MoreModes };

export interface Pitch {
  class: PitchClass;
  octave: Octave;
}

export interface Mark {
  pitch: Pitch | Pitch[] | undefined;
  rest?: boolean;
  duration: NoteDuration;
}

export interface TimeSignature {
  numerator: number;
  denominator: number;
  bpm: number;
}

export interface ChordInfo {
  tonic: PitchClass;
  type: string; // tonaljs acceptable chord type, if invalid defaults to triad
  inversion: number; // if invalide defaults to none
}
