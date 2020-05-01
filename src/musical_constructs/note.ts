import { Octave, isOctave, PitchClass } from "./types";

let temp: number;
temp = Math.random() > 0.5 ? 1 : 23;
let myOctave: Octave;
if (isOctave(temp)) {
  myOctave = temp;
}
