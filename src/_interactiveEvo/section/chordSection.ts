import {
  ChordInfo,
  Mark,
  Mode,
  NoteDuration,
  Octave,
  PitchClass,
} from "../../musical_constructs";
import { ISection } from "../../section";
import { PhenoData } from "../phenoComposer";
import { chordsToBass1, chordsToHarmony1, chordsToMelody1 } from "../voice";

export interface ChordDirective {
  keySig: { tonic: PitchClass; mode: Mode };
  num: number;
  chordInfo: ChordInfo;
  dur: NoteDuration;
}

/**
 * Following a list of chords as a directive to generate voices
 *  caches data to not call RNG second time for diff. results
 */
export class ChordSection implements ISection {
  _cache?: { [key: string]: Mark[] };
  _chordD: ChordDirective[];

  constructor(chords: ChordDirective[] = []) {
    this._chordD = chords;
  }

  getMarks(
    prevSection: ISection,
    nextSection: ISection,
    data: PhenoData = {} as any
  ): { [key: string]: Mark[] } {
    if (!this._cache) {
      this._cache = {
        bass: chordsToBass1(this._chordD),
        harmony: chordsToHarmony1(this._chordD, data["context"], () => {
          return data["gen"].getPercent("harmony");
        }),
        melody: chordsToMelody1(this._chordD),
      };
    }

    return this._cache;
  }
}
