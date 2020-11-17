import { Mode as tMode, Chord as tChord } from "@tonaljs/tonal";
import {
  PitchClass,
  Mode,
  TimeSignature,
  GMInstruments,
  Convert,
  NoteDuration,
  ChordInfo,
} from "../../musical_constructs";
import { ChordStructKB, ChordStructRules, SongForm } from "./kb";
import { Grammar } from "../../Grammar";
import { Genome } from "./genome";
import { PhenoComposer } from "../phenoComposer";
import { ChordDirective, ChordSection } from "../section/chordSection";

// Valence / Arousal based composition
export interface Directive {
  gen: Genome;
  valence: number;
  arousal: number;
}

interface ChordStruct {
  keySig: { tonic: PitchClass; mode: Mode };
  num: number;
  dur: NoteDuration;
}

interface ModeChoice {
  first: Mode;
  second: Mode;
  third: Mode;
}

// Helpful data
// Dark -> light scale of church modes
const _darkLight = [
  Mode.Phrygian,
  Mode.Aeolian,
  Mode.Dorian,
  Mode.Mixolydian,
  Mode.Ionian,
  Mode.Lydian,
];

// Possible BPMs
const _bpms = [60, 70, 80, 90, 100, 110, 120];

// Possible Tonics to choose
const _tonics = [
  PitchClass.C,
  PitchClass.Db,
  PitchClass.D,
  PitchClass.Eb,
  PitchClass.E,
  PitchClass.F,
  PitchClass.Gb,
  PitchClass.G,
  PitchClass.Bb,
  PitchClass.B,
  PitchClass.Ab,
  PitchClass.A,
];

/** Returns normalize val indicating the strength of choice of mode */
function calcModeStrength(d: Directive) {
  const positive = d.valence >= 0;
  let strength = (d.valence + 1) / 2;
  strength = (strength % (1 / _darkLight.length)) * _darkLight.length;

  return positive ? strength : 1 - strength;
}

/** Returns normalize val indicating the strength of choice of mode */
function calcBPMStrength(d: Directive) {
  return (d.arousal % (1 / _bpms.length)) * _bpms.length;
}

function decidePossibleModes(d: Directive): ModeChoice {
  const positive = d.valence >= 0;
  const choice = Math.floor(((d.valence + 1) / 2) * _darkLight.length);
  const strength = calcModeStrength(d);
  // Decide second and third by nearest modes
  let second = _darkLight[choice - 1];
  let third = _darkLight[choice + 1];
  if ((positive && strength > 0.5) || (!positive && strength <= 0.5)) {
    second = _darkLight[choice + 1];
    third = _darkLight[choice - 1];
  }
  second = second ? second : third;
  third = third ? third : second;

  return {
    first: _darkLight[choice],
    second,
    third,
  };
}

function decideTimeSig(d: Directive): TimeSignature {
  const bpmChoice = Math.floor(d.arousal * _bpms.length);
  const num = 4;
  const denom = 4;

  return {
    bpm: _bpms[bpmChoice],
    numerator: num,
    denominator: denom,
  };
}

function decideTonic(d: Directive): PitchClass {
  // Get random tonic note
  const choice =
    (d.gen.getNum("tonic") + d.gen.getNum("tonic")) % _tonics.length;
  return _tonics[choice];
}

function decideVoices(d: Directive): string[] {
  return ["melody", "harmony", "bass"];
}

function decideIntruments(d: Directive): { [key: string]: number } {
  return {
    harmony: GMInstruments.byCategory.strings.violin.number,
    bass: GMInstruments.byCategory.strings.cello.number,
    melody: GMInstruments.byCategory.piano.acoustic_grand_piano.number,
  };
}

// Generation of overall chord structure

function decideSongForm(d: Directive): string {
  return SongForm.ABAB;
}

function generateRules(mode: Mode) {
  // Load proper primary, secondary, dominant, diminished chord for mode (first choice)
  const rules = Object.assign({}, ChordStructRules);
  rules["T2"] = ChordStructKB[mode + "_T2"];
  rules["S"] = ChordStructKB[mode + "_S"];
  rules["D"] = ChordStructKB[mode + "_D"];
  rules["D2"] = ChordStructKB[mode + "_D2"];
  return rules;
}

function decideToInterchange(mode: Mode, comp: PhenoComposer): Mode {
  const chance = comp.data.gen.getPercent("interchange");
  let newMode = mode;
  if (chance < 0.07) {
    newMode = comp.data.modeChoice.second;
  } else if (chance < 0.11) {
    newMode = comp.data.modeChoice.third;
  }

  return newMode ? newMode : mode;
}

const INV_WEIGHTS = [2, 4, 4, 1, 2];

function decideInversion(max: number, choice: number) {
  const dist: { [key: number]: number } = {};
  max = Math.min(max, 4);
  let sum = 0;
  for (let i = 0; i < max; i++) {
    const w = INV_WEIGHTS[i] ? INV_WEIGHTS[i] : 1;
    sum += w;
    dist[i] = w;
  }
  let thres = 0;
  for (let i = 0; i < max; i++) {
    thres += dist[i] / sum;
    if (choice < thres) {
      return i;
    }
  }
  return 0;
}

function decideChordInfo(struct: ChordStruct, comp: PhenoComposer): ChordInfo {
  const chordNum = struct.num - 1;
  const choice = comp.data.gen.getNum("chord_info") % 2;
  const triad = tMode.triads(struct.keySig.mode, struct.keySig.tonic)[chordNum];
  const seven = tMode.seventhChords(struct.keySig.mode, struct.keySig.tonic)[
    chordNum
  ];
  // const eleven = tChord.extended(seven)[0];

  const chordInfo: ChordInfo = Convert.Chord.From.String(
    [triad, seven][choice]
  ) as ChordInfo;

  chordInfo.inversion = decideInversion(
    Convert.Chord.To.Notes(chordInfo).length,
    comp.data.gen.getPercent("chord_info")
  );
  return chordInfo;
}

function toChordDir(chords: ChordStruct[], comp: PhenoComposer) {
  const chordDirs: ChordDirective[] = [];
  chords.forEach((chord) => {
    const keySig = chord.keySig;
    keySig.mode = decideToInterchange(keySig.mode, comp);
    chord.keySig = keySig;
    const chordInfo: ChordInfo = decideChordInfo(chord, comp);
    chordDirs.push({
      keySig: chord.keySig,
      num: chord.num,
      chordInfo,
      dur: chord.dur,
    });
  });

  return chordDirs;
}

function createChordDirs(forms: string[], comp: PhenoComposer) {
  // create grammer
  const rules = generateRules(comp.data.keySig.mode);
  const settings = {
    rng: () => {
      return comp.data.gen.getNum("chord_struct") / 256;
    },
  };
  const g = new Grammar(rules, settings);

  // create chord progression for each unique form
  const measureLen = Convert.TimeSig.To.measureLength(comp.data.timeSig);
  const chordDirs: { [key: string]: ChordDirective[] } = {};
  for (const form of forms) {
    if (!chordDirs[form]) {
      const chordSeq = g.eval("#closed#");
      const chords: ChordStruct[] = [];
      for (const numeral of chordSeq.split(/\s+/)) {
        const chord: ChordStruct = {
          keySig: comp.data.keySig,
          num: parseInt(numeral, 10),
          dur: measureLen,
        };

        chords.push(chord);
      }

      chordDirs[form] = toChordDir(chords, comp);
    }
  }
  return chordDirs;
}

// Construct composition from a genome

const RNG_MAP: { [key: string]: number } = {
  tonic: 3,
  chord_struct: 5,
  chord_info: 7,
  interchange: 13,
};

// converts genome to Composition (the phenotype)
export function toComposition1(d: Directive): PhenoComposer | undefined {
  // set up genome rng
  for (const key of Object.keys(RNG_MAP)) {
    d.gen.addRNG(key, RNG_MAP[key]);
  }

  const pheno = new PhenoComposer();

  // assign metadata to composer
  pheno.data.allVoices = decideVoices(d);
  pheno.data.instrumentMap = decideIntruments(d);
  const modeChoice = decidePossibleModes(d);
  pheno.data["modeChoice"] = modeChoice;
  pheno.data.keySig = {
    tonic: decideTonic(d),
    mode: modeChoice.first,
  };
  pheno.data.timeSig = decideTimeSig(d);
  pheno.data["gen"] = d.gen;
  pheno.data["context"] = {
    arousal: d.arousal,
    valence: d.valence,
    arousalInBPM: calcBPMStrength(d),
    valenceInMode: calcModeStrength(d),
  };

  // add sections
  const songform = decideSongForm(d);
  const forms = songform.split(/\s+/);
  const chordDirs = createChordDirs(forms, pheno);
  const sectionMap: { [key: string]: ChordSection } = {};
  for (const form of forms) {
    if (!sectionMap[form]) {
      sectionMap[form] = new ChordSection(chordDirs[form]);
    }
    pheno.sections.push(sectionMap[form]);
  }

  return pheno;
}
