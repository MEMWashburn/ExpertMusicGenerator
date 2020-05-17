import { NoteDuration } from './duration';

// Used to help create more JS friendly enums
export type EnumLiteralsOf<T extends object> = T[keyof T];
// Helper for custom numerical types that are a subset of all numbers
const numLitArray = <N extends number>(arr: N[]) => arr;
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

export interface TNote {
  octave: Octave;
  pitch: PitchClass;
  duration: NoteDuration;
}

// let temp: number;
// temp = Math.random() > 0.5 ? 1 : 23;
// let myOctave: Octave;
// if (isOctave(temp)) {
//   myOctave = temp;
// }
