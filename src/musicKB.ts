import * as gmiData from './generalMidiInstruments.json';
/* tslint:disable: max-line-length */
// Function creates Genreal Midi Instrument data found in JSON
// const GMInstruments = (function(arr) {
//   var clean = function(name) {
//       return name.replace(/[^a-z0-9 ]/gi, '').replace(/[ ]/g, '_').toLowerCase();
//   };
//   var res = {
//       byName: { },
//       byId: { },
//       byCategory: { }
//   };
//   for (var key in arr) {
//       var list = arr[key];
//       for (var n = 0, length = list.length; n < length; n++) {
//           var instrument = list[n];
//           if (!instrument) continue;
//           var num = parseInt(instrument.substr(0, instrument.indexOf(' ')), 10);
//           instrument = instrument.replace(num + ' ', '');
//           res.byId[--num] =
//           res.byName[clean(instrument)] =
//           {
//               id: clean(instrument),
//               instrument: instrument,
//               number: num,
//               category: key
//           };
//           if (!res.byCategory[clean(key)])
//               res.byCategory[clean(key)] = {};
//           res.byCategory[clean(key)][res.byId[num].id]= res.byId[num];
//       }
//   }
//   return res;
// })({
//   'Piano': ['1 Acoustic Grand Piano', '2 Bright Acoustic Piano', '3 Electric Grand Piano', '4 Honky-tonk Piano', '5 Electric Piano 1', '6 Electric Piano 2', '7 Harpsichord', '8 Clavinet'],
//   'Chromatic Percussion': ['9 Celesta', '10 Glockenspiel', '11 Music Box', '12 Vibraphone', '13 Marimba', '14 Xylophone', '15 Tubular Bells', '16 Dulcimer'],
//   'Organ': ['17 Drawbar Organ', '18 Percussive Organ', '19 Rock Organ', '20 Church Organ', '21 Reed Organ', '22 Accordion', '23 Harmonica', '24 Tango Accordion'],
//   'Guitar': ['25 Acoustic Guitar (nylon)', '26 Acoustic Guitar (steel)', '27 Electric Guitar (jazz)', '28 Electric Guitar (clean)', '29 Electric Guitar (muted)', '30 Overdriven Guitar', '31 Distortion Guitar', '32 Guitar Harmonics'],
//   'Bass': ['33 Acoustic Bass', '34 Electric Bass (finger)', '35 Electric Bass (pick)', '36 Fretless Bass', '37 Slap Bass 1', '38 Slap Bass 2', '39 Synth Bass 1', '40 Synth Bass 2'],
//   'Strings': ['41 Violin', '42 Viola', '43 Cello', '44 Contrabass', '45 Tremolo Strings', '46 Pizzicato Strings', '47 Orchestral Harp', '48 Timpani'],
//   'Ensemble': ['49 String Ensemble 1', '50 String Ensemble 2', '51 Synth Strings 1', '52 Synth Strings 2', '53 Choir Aahs', '54 Voice Oohs', '55 Synth Choir', '56 Orchestra Hit'],
//   'Brass': ['57 Trumpet', '58 Trombone', '59 Tuba', '60 Muted Trumpet', '61 French Horn', '62 Brass Section', '63 Synth Brass 1', '64 Synth Brass 2'],
//   'Reed': ['65 Soprano Sax', '66 Alto Sax', '67 Tenor Sax', '68 Baritone Sax', '69 Oboe', '70 English Horn', '71 Bassoon', '72 Clarinet'],
//   'Pipe': ['73 Piccolo', '74 Flute', '75 Recorder', '76 Pan Flute', '77 Blown Bottle', '78 Shakuhachi', '79 Whistle', '80 Ocarina'],
//   'Synth Lead': ['81 Lead 1 (square)', '82 Lead 2 (sawtooth)', '83 Lead 3 (calliope)', '84 Lead 4 (chiff)', '85 Lead 5 (charang)', '86 Lead 6 (voice)', '87 Lead 7 (fifths)', '88 Lead 8 (bass + lead)'],
//   'Synth Pad': ['89 Pad 1 (new age)', '90 Pad 2 (warm)', '91 Pad 3 (polysynth)', '92 Pad 4 (choir)', '93 Pad 5 (bowed)', '94 Pad 6 (metallic)', '95 Pad 7 (halo)', '96 Pad 8 (sweep)'],
//   'Synth Effects': ['97 FX 1 (rain)', '98 FX 2 (soundtrack)', '99 FX 3 (crystal)', '100 FX 4 (atmosphere)', '101 FX 5 (brightness)', '102 FX 6 (goblins)', '103 FX 7 (echoes)', '104 FX 8 (sci-fi)'],
//   'Ethnic': ['105 Sitar', '106 Banjo', '107 Shamisen', '108 Koto', '109 Kalimba', '110 Bagpipe', '111 Fiddle', '112 Shanai'],
//   'Percussive': ['113 Tinkle Bell', '114 Agogo', '115 Steel Drums', '116 Woodblock', '117 Taiko Drum', '118 Melodic Tom', '119 Synth Drum'],
//   'Sound effects': ['120 Reverse Cymbal', '121 Guitar Fret Noise', '122 Breath Noise', '123 Seashore', '124 Bird Tweet', '125 Telephone Ring', '126 Helicopter', '127 Applause', '128 Gunshot']
// });

/** General Midi Instrument data with lookups via number, instrument name, catagory name. */
export const GMInstruments = {
  byName: gmiData.byName,
  byId: gmiData.byId,
  byCategory: gmiData.byCategory,
};
// console.log(GMInstruments.byCategory.piano.clavinet.id);

/** A mode is a type of musical scale coupled with a set of characteristic melodic behaviors.  */
export enum Mode {
  /** (intervals: Whole - Whole - Half - Whole - Whole - Whole - Half) */
  Ionian = 'ionian',

  /** (intervals: Whole - Half - Whole - Whole - Whole - Half - Whole) */
  Dorian = 'dorian',

  /** (intervals: Half - Whole - Whole - Whole - Half - Whole - Whole) */
  Phrygian = 'phrygian',

  /** (intervals: Whole - Whole - Whole - Half - Whole - Whole - Half) */
  Lydian = 'lydian',

  /** (intervals: Whole - Half - Whole - Whole - Whole - Half - Whole) */
  Mixolydian = 'mixolydian',

  /** (intervals: Whole - Half - Whole - Whole - Half - Whole - Whole) */
  Aeolian = 'aeolian',

  /** (intervals: Half - Whole - Whole - Half - Whole - Whole - Whole) */
  Locrian = 'locrian',
}

/** Class of pitch 12 unique versions*/
export enum PitchClass {
  C = 'C',
  F = 'F',
  Bb = 'Bb',
  Eb = 'Eb',
  Ab = 'Ab',
  Db = 'Db',
  Gb = 'Gb',
  B = 'B',
  E = 'E',
  A = 'A',
  D = 'D',
  G = 'G',
}

/** A note duration (NoteDuration) is the readable version of rhythm durations in music.
 *  They convert to midi-writer-js compatible durations */
export enum NoteDuration {
  zero = '0',
  whole = '1',
  dotDotHalf = 'dd2',
  dotHalf = 'd2',
  half = '2',
  dotDotQuarter = 'dd4',
  dotQuarter = 'd4',
  quarter = '4',
  dotDotEighth = 'dd8',
  dotEighth = 'd8',
  eighth = '8',
  sixteenth = '16',
  thirtySecond = '32',
  sixtyFourth = '64',
  eighthTriplet = '8t',
  sixteenthTriplet = '16t',
}

export const NoteDensityValue = (function() {
  const noteMap: Map<NoteDuration, number> = new Map<NoteDuration, number>();

  noteMap.set(NoteDuration.whole, 1);
  noteMap.set(NoteDuration.dotHalf, 1.5);
  noteMap.set(NoteDuration.half, 2);
  noteMap.set(NoteDuration.dotQuarter, 3);
  noteMap.set(NoteDuration.quarter, 4);
  noteMap.set(NoteDuration.dotEighth, 6);
  noteMap.set(NoteDuration.eighth, 8);
  noteMap.set(NoteDuration.sixteenth, 16);

  return noteMap;
})();

export const NumOfQuarters = (function() {
  const noteMap: Map<NoteDuration, number> = new Map<NoteDuration, number>();

  noteMap.set(NoteDuration.whole, 4);
  noteMap.set(NoteDuration.dotHalf, 3);
  noteMap.set(NoteDuration.half, 2);
  noteMap.set(NoteDuration.quarter, 1);

  return noteMap;
})();

export const NoteDurSubdivisions = (function() {
  const durMap: Map<NoteDuration, Array<NoteDuration[]>> = new Map<NoteDuration, Array<NoteDuration[]>>();

  const wholes: Array<NoteDuration[]> = [];
  wholes.push(
    [NoteDuration.half, NoteDuration.half],
    [NoteDuration.dotHalf, NoteDuration.quarter],
    [NoteDuration.quarter, NoteDuration.dotHalf]);
  durMap.set(NoteDuration.whole, wholes);

  const dotHalves: Array<NoteDuration[]> = [];
  dotHalves.push(
    [NoteDuration.half, NoteDuration.quarter],
    [NoteDuration.quarter, NoteDuration.half],
    [NoteDuration.quarter, NoteDuration.quarter, NoteDuration.quarter]);
  durMap.set(NoteDuration.dotHalf, dotHalves);

  const halfs: Array<NoteDuration[]> = [];
  halfs.push(
    [NoteDuration.quarter, NoteDuration.quarter],
    [NoteDuration.dotQuarter, NoteDuration.eighth],
    [NoteDuration.eighth, NoteDuration.dotQuarter]);
  durMap.set(NoteDuration.half, halfs);

  const dotQuarters: Array<NoteDuration[]> = [];
  dotQuarters.push(
    [NoteDuration.quarter, NoteDuration.eighth],
    [NoteDuration.eighth, NoteDuration.quarter],
    [NoteDuration.eighth, NoteDuration.eighth, NoteDuration.eighth]);
  durMap.set(NoteDuration.dotQuarter, dotQuarters);

  const quarters: Array<NoteDuration[]> = [];
  quarters.push(
    [NoteDuration.eighth, NoteDuration.eighth],
    [NoteDuration.dotEighth, NoteDuration.sixteenth],
    [NoteDuration.sixteenth, NoteDuration.dotEighth]);
  durMap.set(NoteDuration.quarter, quarters);

  const dotEighths: Array<NoteDuration[]> = [];
  dotEighths.push(
    [NoteDuration.eighth, NoteDuration.sixteenth],
    [NoteDuration.sixteenth, NoteDuration.eighth],
    [NoteDuration.sixteenth, NoteDuration.sixteenth, NoteDuration.sixteenth]);
  durMap.set(NoteDuration.dotEighth, dotEighths);

  const eighths: Array<NoteDuration[]> = [];
  eighths.push(
    [NoteDuration.sixteenth, NoteDuration.sixteenth]);
  durMap.set(NoteDuration.eighth, eighths);

  // const sixteenths: Array<NoteDuration[]> = [];
  // sixteenths.push(
  //   [NoteDuration.thirtySecond, NoteDuration.thirtySecond]);
  // durMap.set(NoteDuration.sixteenth, sixteenths);

  return durMap;
})();

/** A chord, in music, is any harmonic set of pitches consisting of multiple notes (also called "pitches")
 * that are heard as if sounding simultaneously. */
export enum ChordType {
  Triad = 'triad',
  Seven = 'seven',
  Nine = 'nine',
  Eleven = 'eleven',
  Thirteen = 'thirteen',
}

export interface TimeSignature {
  numerator: number;
  denominator: number;
  bpm: number;
}

export enum SongForm {
  AAA = 'A A A', // Strophic
  AABA = 'A A B A', // "American Pop"
  AABABA = 'A A B A B A', // Extended
  AB = 'A B', // Verse -> Chorus
  ABC = 'A B C', // Verse -> Chorus -> Bridge
  ABAB = 'A B A B',
  ABAC = 'A B A C',
  ABCD = 'A B C D',
  AAB = 'A A B', // "12-bar blues"
}

export const ChordStructRules = {
  origin: [
    '#closed# #closed#',
    '#closed# #open#',
    '#closed# #open# #closed#',
    '#closed# #open# #open# #closed#',
  ],
  closed: [
    '#c4#',
    '#c5#',
  ],
  c4: [
    '#T# #S# #D# #T2#',
    '#T# #D# #S# #T2#',
  ],
  c5: [
    '#T# #D2# #D# #S# #T2#',
  ],
  c6: [
    '#T# #S# #D# #T2# #S# #T#',
  ],
  c7: [
    '#T# #D2# #T2# #D# #T2# #D2# #T#',
    '#T# #S# #T2# #D2# #T2# #D# #T#',
  ],
  open: [
    '#o4#',
    '#o5#',
  ],
  o4: [
    '#D# #T# #S# #D#',
    '#D2# #T2# #S# #D#',
  ],
  o5: [
    '#D# #T# #D# #S# #D2#',
  ],
  o6: [
    '#D# #T2# #D# #T2# #S# #D#',
  ],
  o7: [
    '#D# #S# #T2# #D2# #T2# #S# #D#',
  ],

  // Default Ionian (Major): Logic for placement for QUARTAL chords, not tertian
  // T = Tonic
  // T2 = Replacals for tonic after establishment
  // S = Subdominant
  // D = Dominant
  // D2 = Replacals for dominant after establishment
  T: ['1'],
  T2: ['1', '3', '6'], // Tonic: Contains root note, NO character tone
  S: ['2', '4'], // Non-Cadential: NO root note, NO character tone
  D: ['5'], // Cadential_1: Defining character tone chord, last primary
  D2: ['5', '7'], // Cadential_2: Contains Character Tone
};

export const ChordStructKB: { [key: string]: string[] } = {
  // Harmonic Functions: Tonals, Subdominants, Dominants
  // Build around the Characteristic Note of the given mode

  // Lydian chord num classification - MODAL
  lydian_T2: ['1', '6'],
  lydian_S: ['3'],
  lydian_D: ['2'],
  lydian_D2: ['2', '4', '5', '7'], // No '5' for 3rd chords
  // Ionian chord num classification - TONAL
  ionian_T2: ['1', '3', '6'],
  ionian_S: ['2', '4'],
  ionian_D: ['5'],
  ionian_D2: ['5', '7'],
  // Mixolydian chord num classification - MODAL
  mixolydian_T2: ['1', '2', '4', '6'], // No '2' for 3rd chords
  mixolydian_S: ['2'],
  mixolydian_D: ['7'],
  mixolydian_D2: ['3', '5', '7'],
  // Dorian chord num classification - MODAL
  dorian_T2: ['1', '6'], // NOTE: '6' contains BOTH root and character tone
  dorian_S: ['3', '5', '7'],
  dorian_D: ['4'],
  dorian_D2: ['2', '4', '6'],
  // Aeolian chord num classification - TONAL
  aeolian_T2: ['1', '3', '6'],
  aeolian_S: ['2', '4'],
  aeolian_D: ['5'],
  aeolian_D2: ['5', '7'],
  // Phrygian chord num classification - MODAL
  phrygian_T2: ['1', '4', '6'],
  phrygian_S: ['4'], // Most tendency towards '3' (D)
  phrygian_D: ['3'],
  phrygian_D2: ['2', '3', '5', '7'],
  // Locrian chord num classification - ASDF
  locrian_T2: ['1', '4'],
  locrian_S: ['2', '7'],
  locrian_D: ['6'],
  locrian_D2: ['3', '5', '6'],

  // Primary and Secondary
  // Lydian chord num classification - MODAL
  lydian_Prim: ['1', '2'],
  lydian_Sec: ['3', '5', '6', '7'],
  lydian_Dom: ['2'],
  lydian_Dim: ['4'],
  // Ionian chord num classification - TONAL
  ionian_Prim: ['1', '4', '5'],
  ionian_Sec: ['2', '3', '6'],
  ionian_Dom: ['5'],
  ionian_Dim: ['7'],
  // Mixolydian chord num classification - MODAL
  mixolydian_Prim: ['1', '7'],
  mixolydian_Sec: ['2', '4', '5', '6'],
  mixolydian_Dom: ['7'],
  mixolydian_Dim: ['3'],
  // Dorian chord num classification - MODAL
  dorian_Prim: ['1', '3', '4'],
  dorian_Sec: ['2', '5', '7'],
  dorian_Dom: ['4'],
  dorian_Dim: ['6'],
  // Aeolian chord num classification - TONAL
  aeolian_Prim: ['1', '6', '7'],
  aeolian_Sec: ['3', '4', '5'],
  aeolian_Dom: ['7'],
  aeolian_Dim: ['2'],
  // Phrygian chord num classification - MODAL
  phrygian_Prim: ['1', '2', '3'],
  phrygian_Sec: ['4', '6', '7'],
  phrygian_Dom: ['3'],
  phrygian_Dim: ['5'],
  // Locrian chord num classification - ASDF
  locrian_Prim: ['5', '6'],
  locrian_Sec: ['2', '3', '4', '7'],
  locrian_Dom: ['6'],
  locrian_Dim: ['1'],
};
