import {
  Mode,
  PitchClass,
  ChordType,
  TimeSignature,
  ChordStructRules,
  SongForm,
  ChordStructKB,
  NoteDuration,
  GMInstruments,
} from './musicKB';
import { Chord } from './chord';
import { Track, NoteEvent, ProgramChangeEvent, Writer } from 'midi-writer-js';
import { Grammar } from './Grammar';
import { Scale } from 'tonal';
import { SectionData, Section } from './section';
import { VConstructor } from './voice';
import { Harmony } from './harmony';
import { Bass } from './bass';
import { BitString, NumberGenerator } from './BitString';
import { Melody } from './melody';

export enum TimePeriod {
  Past = 'past',
  Present = 'present',
  Future = 'future',
}

interface ModeChoice {
  first: Mode;
  second: Mode;
  third: Mode;
}

// Helpful data
// Dark -> light scale of modes
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
  PitchClass.F,
  PitchClass.Bb,
  PitchClass.Eb,
  PitchClass.Ab,
  PitchClass.Db,
  PitchClass.Gb,
  PitchClass.B,
  PitchClass.E,
  PitchClass.A,
  PitchClass.D,
  PitchClass.G,
];

/** A class that uses musical constructs to compose a song given the parameters: arousal, valence, and time period.
 */
export class Composition {
  /** The top 3 mode choices for the composition. */
  private modeChoice: ModeChoice = {
    first: Mode.Ionian,
    second: Mode.Ionian,
    third: Mode.Ionian,
  };

  /** The chosen tonic note of the composition. */
  private tonic: PitchClass = PitchClass.G;

  /** The BPM and Time Signature of the composition */
  private timeSig: TimeSignature = { bpm: 80, numerator: 4, denominator: 4 };

  /** All the possible voices this composition holds the keys also map to the specific midi channel.
   *  Remember: Percussion is always channel 10.
   */
  private voices: { [key: string]: VConstructor } = {};

  /** Instruments tied to each of the voices in composition */
  private intsruments: { [key: string]: any } = {};

  /** Song Structure holds the overarching structure of the composition. It can be used to trigger many things
   *  Example structure: 'AABA'
   */
  private songForm = 'A A B A';

  /** Chord Structure holds the succesion of musical chords in their most basic form (a roman numeral number).
   *  Each small segment of successive musical chords are mapped to a letter in the Song Structure.
   */
  private chordStructs: { [key: string]: string } = {};

  /** Chord Progression contains a list of Chord objects representing the chord progression for each unique song structure.
   *  Each chord object contains all the necessary info to resolve to a set of specific notes.
   */
  private chordProgs: { [key: string]: Chord[] } = {};

  /** Creates section data according to each unique structure defined in songStruct
   */
  private sectionData: { [key: string]: SectionData } = {};

  /** Creates sections based off the song Struct in proper order
   */
  private sections: Section[] = [];

  /** If parameters that alter music generation have been modified */
  private modified = true;

  /** Constructs a composition holding all necessary information to build its song (midi) */
  constructor(
    /** Arousal used to control the speed or energy conveyed by the composed music*/
    private arousal: number,
    /** Valence used to control the positive or negative emotion felt by the composed music
     *
     * Valence, as used in psychology, especially in discussing emotions, means the intrinsic attractiveness/"good"-ness
     * (positive valence) or averseness/"bad"-ness (negative valence) of an event, object, or situation.*/
    private valence: number,
    /** Time Period felt by the composed music*/
    private timePeriod: TimePeriod,
    /** Seed used to determine generation of parts of the composition*/
    private seed: BitString,
  ) {
    this.generate();
  }

  public generate() {
    if (!this.modified) {
      return;
    }

    this.modeChoice = this.decidePossibleModes();
    this.timeSig = this.decideTimeSig();
    this.tonic = this.decideTonic();
    this.voices = this.decideVoices();
    this.intsruments = this.decideIntruments();
    this.songForm = this.decideSongForm();

    this.generateSectionData();
    this.generateChordStructs();
    this.generateChordProgressions();

    this.constructSections();

    this.modified = false;
  }

  private decidePossibleModes(): ModeChoice {
    const positive = this.valence >= 0;
    const choice = Math.floor(((this.valence + 1) / 2) * _darkLight.length);
    const strength = this.calcModeStrength();
    // Decide second and third by nearest modes
    let second = _darkLight[choice - 1];
    let third = _darkLight[choice + 1];
    if ((positive && strength > 0.5) || (!positive && strength <= 0.5)) {
      second = _darkLight[choice + 1];
      third = _darkLight[choice - 1];
    }

    return {
      first: _darkLight[choice],
      second: second ? second : Mode.Locrian,
      third: third ? third : Mode.Locrian,
    };
  }

  /** Returns normalize val indicating the strength of choice of mode */
  private calcModeStrength() {
    const positive = this.valence >= 0;
    let strength = (this.valence + 1) / 2;
    strength = (strength % (1 / _darkLight.length)) * _darkLight.length;

    return positive ? strength : 1 - strength;
  }

  private decideTimeSig(): TimeSignature {
    const bpmChoice = Math.floor(this.arousal * _bpms.length);
    const num = 4;
    const denom = 4;

    // Setting to 3/4 for "waltz" feel
    // if (this.valence > 0.5) {
    //   num = 3;
    // }

    return {
      bpm: _bpms[bpmChoice],
      numerator: num,
      denominator: denom,
    };
  }

  private calcBPMStrength() {
    return (this.arousal % (1 / _bpms.length)) * _bpms.length;
  }

  private decideTonic(): PitchClass {
    // Get random tonic note
    const choice = this.seed.toByteArray()[0] % 12;
    return _tonics[choice];
  }

  private decideVoices(): { [key: string]: VConstructor } {
    return {
      '1': Harmony,
      '2': Bass,
      '3': Melody,
    };
  }

  private decideIntruments(): { [key: string]: any } {
    return {
      '1': GMInstruments.byCategory.strings.violin.number,
      '2': GMInstruments.byCategory.strings.cello.number,
      '3': GMInstruments.byCategory.piano.acoustic_grand_piano.number,
    };
  }

  private decideSongForm(): string {
    return SongForm.ABAB;
  }

  private generateSectionData(): void {
    for (const form of this.songForm.split(/\s+/)) {
      if (!this.sectionData[form]) {
        this.sectionData[form] = {
          type: 'closed',
          chordProgression: [],
          voices: this.voices,
        };
      }
    }
  }

  private generateChordStructs(): void {
    // Load proper primary, secondary, dominant, diminished chord for mode (first choice)
    const rules = Object.assign({}, ChordStructRules);
    rules['T2'] = ChordStructKB[(this.modeChoice.first as String) + '_T2'];
    rules['S'] = ChordStructKB[(this.modeChoice.first as String) + '_S'];
    rules['D'] = ChordStructKB[(this.modeChoice.first as String) + '_D'];
    rules['D2'] = ChordStructKB[(this.modeChoice.first as String) + '_D2'];

    const setting = {
      seed: this.seed.toByteArray(),
    };
    const g = new Grammar(rules, setting);

    for (const form of this.songForm.split(/\s+/)) {
      if (!this.chordStructs[form]) {
        const chordStruct = g.eval('#' + this.sectionData[form].type + '#');
        this.chordStructs[form] = chordStruct;
      }
    }
  }

  private generateChordProgressions(): void {
    for (const form of this.songForm.split(/\s+/)) {
      if (!this.chordProgs[form]) {
        const chords = [];
        for (const num of this.chordStructs[form].split(/\s+/)) {
          const chordNum = parseInt(num, 10);
          const chord = new Chord(
            this.modeChoice.first,
            this.tonic,
            chordNum,
            this.decideChordType(chordNum),
            0,
            3,
            this.decideNoteDur(),
          );
          chords.push(chord);
        }
        this.chordProgs[form] = chords;
        this.sectionData[form].chordProgression = chords;
      }
    }
  }

  private decideChordType(chordNum: number): ChordType {
    let ct = ChordType.Triad;
    // Now just using ONLY Dominant 7ths per mode for function, not color
    switch (this.modeChoice.first) {
      case Mode.Ionian:
        if (chordNum === 5) {
          ct = ChordType.Seven;
        }
        break;
      case Mode.Dorian:
        if (chordNum === 4) {
          ct = ChordType.Seven;
        }
        break;
      case Mode.Phrygian:
        if (chordNum === 3) {
          ct = ChordType.Seven;
        }
        break;
      case Mode.Lydian:
        if (chordNum === 2) {
          ct = ChordType.Seven;
        }
        break;
      case Mode.Mixolydian:
        if (chordNum === 1) {
          ct = ChordType.Seven;
        }
        break;
      case Mode.Aeolian:
        if (chordNum === 7) {
          ct = ChordType.Seven;
        }
        break;
      case Mode.Phrygian:
        if (chordNum === 6) {
          ct = ChordType.Seven;
        }
        break;
    }
    return ct;
  }

  private decideNoteDur(): NoteDuration {
    let noteDur = NoteDuration.whole;
    this.timeSig.numerator % 3 === 0
      ? (noteDur = NoteDuration.dotHalf)
      : (noteDur = noteDur);
    return noteDur;
  }

  private constructSections(): void {
    const voiceSeeds: { [key: string]: NumberGenerator } = {};
    for (const channel of Object.keys(this.voices)) {
      voiceSeeds[channel] = this.seed.getNumberGenerator();
    }
    const builtSections: { [key: string]: Section } = {};

    for (const form of this.songForm.split(/\s+/)) {
      if (!builtSections[form]) {
        builtSections[form] = new Section(this, this.sectionData[form], {
          numGenerators: voiceSeeds,
        });
        builtSections[form].build();
      }
      this.sections.push(builtSections[form]);
    }
  }

  public getTonic(): PitchClass {
    return this.tonic;
  }

  public getTimeSig(): TimeSignature {
    return this.timeSig;
  }

  public getModeChoices(): ModeChoice {
    return this.modeChoice;
  }

  public getContext() {
    return {
      arousal: this.arousal,
      valence: this.valence,
      timePeriod: this.timePeriod,
      arousalInBPM: this.calcBPMStrength(),
      valenceInMode: this.calcModeStrength(),
    };
  }

  public getMidi(name: String): Writer {
    // Create midi meta data
    const metaData: Track = new Track();
    metaData.addTrackName(name);
    // Try to find and set key signature
    for (const scales of Scale.modeNames(
      this.tonic + ' ' + this.modeChoice.first,
    )) {
      if (scales[1] === 'major') {
        metaData.setKeySignature(scales[0], undefined);
        break;
      }
    }
    metaData.setTempo(this.timeSig.bpm);
    metaData.setTimeSignature(this.timeSig.numerator, this.timeSig.denominator);

    const tracks = [];
    tracks.push(metaData);

    // Set up tracks
    const channels: { [key: string]: Track } = {};
    const allChannels = Object.keys(this.voices);
    for (const channel of allChannels) {
      const track = new Track();
      track.addTrackName('Channel ' + channel);
      track.addEvent(
        new ProgramChangeEvent({ instrument: this.intsruments[channel] }),
      );
      channels[channel] = track;
    }
    // Generate notes
    for (const section of this.sections) {
      const events = section.getNoteEvents();
      for (const channel of allChannels) {
        channels[channel].addEvent(
          events[channel],
          (index: any, event: any) => {
            return { channel: parseInt(channel, 10) };
          },
        );
      }
    }
    // Assemble voice tracks for midi file
    for (const channel of allChannels) {
      tracks.push(channels[channel]);
    }

    const write = new Writer(tracks);
    return write;
  }
}
