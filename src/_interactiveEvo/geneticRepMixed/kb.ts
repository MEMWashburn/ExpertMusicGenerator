// musical constructs additionals

export const SongForm = {
  AAA: "A A A", // Strophic
  AABA: "A A B A", // "American Pop"
  AABABA: "A A B A B A", // Extended
  AB: "A B", // Verse -> Chorus
  ABC: "A B C", // Verse -> Chorus -> Bridge
  ABAB: "A B A B",
  ABAC: "A B A C",
  ABCD: "A B C D",
  AAB: "A A B", // "12-bar blues"
};

export const ChordStructRules = {
  origin: [
    "#closed# #closed#",
    "#closed# #open#",
    "#closed# #open# #closed#",
    "#closed# #open# #open# #closed#",
  ],
  closed: ["#c4#", "#c5#"],
  c4: ["#T# #S# #D# #T2#", "#T# #D# #S# #T2#"],
  c5: ["#T# #D2# #D# #S# #T2#"],
  c6: ["#T# #S# #D# #T2# #S# #T#"],
  c7: ["#T# #D2# #T2# #D# #T2# #D2# #T#", "#T# #S# #T2# #D2# #T2# #D# #T#"],
  open: ["#o4#", "#o5#"],
  o4: ["#D# #T# #S# #D#", "#D2# #T2# #S# #D#"],
  o5: ["#D# #T# #D# #S# #D2#"],
  o6: ["#D# #T2# #D# #T2# #S# #D#"],
  o7: ["#D# #S# #T2# #D2# #T2# #S# #D#"],

  // Default Ionian (Major): Logic for placement for QUARTAL chords, not tertian
  // T = Tonic
  // T2 = Replacals for tonic after establishment
  // S = Subdominant
  // D = Dominant
  // D2 = Replacals for dominant after establishment
  T: ["1"],
  T2: ["1", "3", "6"], // Tonic: Contains root note, NO character tone
  S: ["2", "4"], // Non-Cadential: NO root note, NO character tone
  D: ["5"], // Cadential_1: Defining character tone chord, last primary
  D2: ["5", "7"], // Cadential_2: Contains Character Tone
};

export const ChordStructKB: { [key: string]: string[] } = {
  // Harmonic Functions: Tonals, Subdominants, Dominants
  // Build around the Characteristic Note of the given mode

  // Lydian chord num classification - MODAL
  lydian_T2: ["1", "6"],
  lydian_S: ["3"],
  lydian_D: ["2"],
  lydian_D2: ["2", "4", "5", "7"], // No '5' for 3rd chords
  // Ionian chord num classification - TONAL
  ionian_T2: ["1", "3", "6"],
  ionian_S: ["2", "4"],
  ionian_D: ["5"],
  ionian_D2: ["5", "7"],
  // Mixolydian chord num classification - MODAL
  mixolydian_T2: ["1", "2", "4", "6"], // No '2' for 3rd chords
  mixolydian_S: ["2"],
  mixolydian_D: ["7"],
  mixolydian_D2: ["3", "5", "7"],
  // Dorian chord num classification - MODAL
  dorian_T2: ["1", "6"], // NOTE: '6' contains BOTH root and character tone
  dorian_S: ["3", "5", "7"],
  dorian_D: ["4"],
  dorian_D2: ["2", "4", "6"],
  // Aeolian chord num classification - TONAL
  aeolian_T2: ["1", "3", "6"],
  aeolian_S: ["2", "4"],
  aeolian_D: ["5"],
  aeolian_D2: ["5", "7"],
  // Phrygian chord num classification - MODAL
  phrygian_T2: ["1", "4", "6"],
  phrygian_S: ["4"], // Most tendency towards '3' (D)
  phrygian_D: ["3"],
  phrygian_D2: ["2", "3", "5", "7"],
  // Locrian chord num classification - ASDF
  locrian_T2: ["1", "4"],
  locrian_S: ["2", "7"],
  locrian_D: ["6"],
  locrian_D2: ["3", "5", "6"],

  // Primary and Secondary
  // Lydian chord num classification - MODAL
  lydian_Prim: ["1", "2"],
  lydian_Sec: ["3", "5", "6", "7"],
  lydian_Dom: ["2"],
  lydian_Dim: ["4"],
  // Ionian chord num classification - TONAL
  ionian_Prim: ["1", "4", "5"],
  ionian_Sec: ["2", "3", "6"],
  ionian_Dom: ["5"],
  ionian_Dim: ["7"],
  // Mixolydian chord num classification - MODAL
  mixolydian_Prim: ["1", "7"],
  mixolydian_Sec: ["2", "4", "5", "6"],
  mixolydian_Dom: ["7"],
  mixolydian_Dim: ["3"],
  // Dorian chord num classification - MODAL
  dorian_Prim: ["1", "3", "4"],
  dorian_Sec: ["2", "5", "7"],
  dorian_Dom: ["4"],
  dorian_Dim: ["6"],
  // Aeolian chord num classification - TONAL
  aeolian_Prim: ["1", "6", "7"],
  aeolian_Sec: ["3", "4", "5"],
  aeolian_Dom: ["7"],
  aeolian_Dim: ["2"],
  // Phrygian chord num classification - MODAL
  phrygian_Prim: ["1", "2", "3"],
  phrygian_Sec: ["4", "6", "7"],
  phrygian_Dom: ["3"],
  phrygian_Dim: ["5"],
  // Locrian chord num classification - ASDF
  locrian_Prim: ["5", "6"],
  locrian_Sec: ["2", "3", "4", "7"],
  locrian_Dom: ["6"],
  locrian_Dim: ["1"],
};
