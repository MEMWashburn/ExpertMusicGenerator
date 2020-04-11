import { Mode, PitchClass, ChordType, NoteDuration } from './musicKB';
import { Scale } from 'tonal';
import { transpose } from 'tonal-distance';

/** A class representing a chord for use in chord progressions */
export class Chord {

  private notes: string[];

  constructor(
    private mode: Mode,
    private tonic: PitchClass,
    private chordNum: number, /* 1-7 per mode */
    private chordType: ChordType,
    private inversion: number,
    private octaveNum: number, /* 1-8 on piano */
    private duration: NoteDuration,
  ) {
    this.notes = this.getNotes();
  }

  public getDuration(): NoteDuration {
    return this.duration;
  }

  public getTonic(): PitchClass {
    return this.tonic;
  }

  public getMode(): Mode {
    return this.mode;
  }

  public getType(): ChordType {
    return this.chordType;
  }

  /** returns scribbletunes-friendly format
   * example: Chord c = new Chord(mode: Mode.Ionian, tonic: Note.C, chordNum: 1, chordType: ChordType.Triad,
   *                                inversion: 0, octaveNum: 5)
   *          c.getNotes(); // returns ["C5", "E5", "G5"]
   */
  public getNotes(pitch?: number): string[] {
    // Construct the chord from list of notes in mode
    const octave = pitch ? pitch.toString() : this.octaveNum.toString();
    const modeNotes = Scale.notes(
      this.tonic + octave,
      this.mode,
    );
    const modeIndex = this.chordNum - 1;
    let chordNotes: string[] = [];

    // Make chord
    switch (this.chordType) {
      case ChordType.Triad:
        chordNotes = this.getTriad(modeNotes, modeIndex);
        break;
      case ChordType.Seven:
        chordNotes = this.getSeventh(modeNotes, modeIndex);
        break;
      case ChordType.Nine:
        chordNotes = this.getNinth(modeNotes, modeIndex);
        break;
      case ChordType.Eleven:
        chordNotes = this.getEleventh(modeNotes, modeIndex);
        break;
      case ChordType.Thirteen:
        chordNotes = this.getThirteenth(modeNotes, modeIndex);
        break;
      default: // Defaults to Triad
        chordNotes = this.getTriad(modeNotes, modeIndex);
        break;
    }

    // Do inversions; ninth, eleventh, and thirteenth chords not commonly inverted
    if (this.inversion >= chordNotes.length || this.chordType === ChordType.Nine ||
      this.chordType === ChordType.Eleven || this.chordType === ChordType.Thirteen) {
      this.inversion = 0;
    }

    for (let note = 0; note < this.inversion; note++) {
      chordNotes[note] = transpose(chordNotes[note], 'P8').toString();
    }
    for (let note = 0; note < this.inversion; note++) {
      const temp = chordNotes.shift();
      chordNotes.push(temp ? temp : '');
    }

    return chordNotes;
  }

  private getTriad(modeNotes: string[], modeIndex: number): string[] {
    const root = modeNotes[modeIndex];

    let third = modeNotes[(modeIndex + 2) % modeNotes.length];
    if (modeIndex + 2 >= modeNotes.length) {
      third = transpose(third, 'P8').toString();
    }

    let fifth = modeNotes[(modeIndex + 4) % modeNotes.length];
    if (modeIndex + 4 >= modeNotes.length) {
      fifth = transpose(fifth, 'P8').toString();
    }

    return [root, third, fifth];
  }

  private getSeventh(modeNotes: string[], modeIndex: number): string[] {
    const root = modeNotes[modeIndex];

    let third = modeNotes[(modeIndex + 2) % modeNotes.length];
    if (modeIndex + 2 >= modeNotes.length) {
      third = transpose(third, 'P8').toString();
    }

    let fifth = modeNotes[(modeIndex + 4) % modeNotes.length];
    if (modeIndex + 4 >= modeNotes.length) {
      fifth = transpose(fifth, 'P8').toString();
    }

    let seventh = modeNotes[(modeIndex + 6) % modeNotes.length];
    if (modeIndex + 6 >= modeNotes.length) {
      seventh = transpose(seventh, 'P8').toString();
    }

    return [root, third, fifth, seventh];
  }

  // Ninth through Thirteenth return triads for now (b/c I don't know if same pattern)
  private getNinth(modeNotes: string[], modeIndex: number): string[] {
    const root = modeNotes[modeIndex];
    let third = modeNotes[(modeIndex + 2) % modeNotes.length];
    if (modeIndex + 2 >= modeNotes.length) {
      third = transpose(third, 'P8').toString();
    }

    let seventh = modeNotes[(modeIndex + 6) % modeNotes.length];
    if (modeIndex + 6 >= modeNotes.length) {
      seventh = transpose(seventh, 'P8').toString();
    }

    let ninth = modeNotes[(modeIndex + 8) % modeNotes.length];
    if (modeIndex + 8 >= modeNotes.length) {
      ninth = transpose(ninth, 'P8').toString();
    }
    return [root, third, seventh, ninth];
  }

  private getEleventh(modeNotes: string[], modeIndex: number): string[] {
    const root = modeNotes[modeIndex];
    let seventh = modeNotes[(modeIndex + 6) % modeNotes.length];
    if (modeIndex + 6 >= modeNotes.length) {
      seventh = transpose(seventh, 'P8').toString();
    }

    let ninth = modeNotes[(modeIndex + 8) % modeNotes.length];
    if (modeIndex + 8 >= modeNotes.length) {
      ninth = transpose(ninth, 'P8').toString();
    }

    let eleventh = modeNotes[(modeIndex + 2) % modeNotes.length];
    if (modeIndex + 2 >= modeNotes.length) {
      eleventh = transpose(eleventh, 'P8').toString();
    }
    return [root, seventh, ninth, eleventh];
  }

  private getThirteenth(modeNotes: string[], modeIndex: number): string[] {
    const root = modeNotes[modeIndex];
    let third = modeNotes[(modeIndex + 2) % modeNotes.length];
    if (modeIndex + 2 >= modeNotes.length) {
      third = transpose(third, 'P8').toString();
    }

    let seventh = modeNotes[(modeIndex + 6) % modeNotes.length];
    if (modeIndex + 6 >= modeNotes.length) {
      seventh = transpose(seventh, 'P8').toString();
    }

    let thirteenth = modeNotes[(modeIndex + 6) % modeNotes.length];
    if (modeIndex + 6 >= modeNotes.length) {
      thirteenth = transpose(thirteenth, 'P8').toString();
    }
    return [root, third, seventh, thirteenth];
  }
}
