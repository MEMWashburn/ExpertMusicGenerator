import { midiWriterBridge } from "../util";
import {
  Mark,
  Mode,
  NoteDuration,
  PitchClass,
  TimeSignature,
} from "../musical_constructs";
import { ISection } from "../section";
import { SectionalComposer } from "../composition";

interface PhenoDat {
  allVoices: string[];
  timeSig: TimeSignature;
  keySig: { tonic: PitchClass; mode: Mode };
  instrumentMap: { [key: string]: number };
}

export type PhenoData = PhenoDat & { [key: string]: any };

export class PhenoComposer extends SectionalComposer {
  data: PhenoData = {
    allVoices: [],
    timeSig: { bpm: 80, numerator: 4, denominator: 4 },
    keySig: { tonic: PitchClass.C, mode: Mode.Aeolian },
    instrumentMap: {},
  };
  sections: ISection[] = [];

  createMidiData(name?: string | undefined): string {
    const marks = this.getAllMarks();
    return midiWriterBridge.createBase64Midi(
      {
        name,
        timeSig: this.data.timeSig,
        tonic: this.data.keySig.tonic,
        mode: this.data.keySig.mode,
        intruments: this.data.instrumentMap,
      },
      marks
    );
  }
}
