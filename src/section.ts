import { Chord } from './chord';
import { Composition } from './composition';
import { Voice, VConstructor } from './voice';
import { NoteEvent } from 'midi-writer-js';

/** Data necessary to define a section */
export interface SectionData {
  /** Type of section; describes section's musical feel */
  type: string; // Currently 'open' or 'closed', 'origin' = combination
  /** Transition style from previous section */
  prevTransition?: string; // Currently 'high' or 'low'
  /** Transition style to prep for next section */
  nextTransition?: string; // Currently 'high' or 'low'
  /** List of chords outlining the section */
  chordProgression: Chord[];
  /** Voices used in this section (masked or not) */
  voices: { [key: string]: VConstructor };
  /** Optional mask for the voices (ie. still generate them but mask may change). */
  voicesMask?: { [key: string]: boolean };
}

/** A section in music defines a segment of the final composition that carries specific mood and
 *  a notion of how it transitions to the next section and/or from the prev section.
 */
export class Section {
  /** The composition class section is contained in. To access global info */
  private comp: Composition;
  /** Type of section; describes section's musical feel */
  private type: string; // Currently 'open' or 'closed'
  /** List of chords outlining the section */
  private chordProgression: Chord[];
  /** The voices this section cares about. */
  private voices: { [key: string]: Voice };
  /** Optional mask for the voices (ie. still generate them but mask may change). */
  private voicesMask: { [key: string]: boolean };
  /** Transition style from previous section */
  private prevTransition?: string; // Currently 'high' or 'low'
  /** Transition style to prep for next section */
  private nextTransition?: string; // Currently 'high' or 'low'
  /** The previous section leading into this one for possible reference */
  private prevSection?: Section;
  /** The next section leading after this one for possible reference */
  private nextSection?: Section;

  constructor(comp: Composition, data: SectionData, args: any) {
    this.comp = comp;
    this.type = data.type;
    this.chordProgression = data.chordProgression;

    if (data.prevTransition) {
      this.prevTransition = data.prevTransition;
      this.prevSection = args.prevSection;
    }

    if (data.nextTransition) {
      this.nextTransition = data.nextTransition;
      this.nextSection = args.nextSection;
    }

    this.voices = {};
    this.voicesMask = {};
    for (const channel of Object.keys(data.voices)) {
      this.voicesMask[channel] = true;
      this.voices[channel] = new data.voices[channel](
        this.comp,
        this,
        this.chordProgression,
        args.numGenerators ? args.numGenerators[channel] : undefined,
      );
    }
  }

  public changeVoicesMask(mask: { [key: string]: boolean }) {
    this.voicesMask = mask;
  }

  public getType(): string {
    return this.type;
  }

  public getVoices(): {[key: string]: Voice} {
    return this.voices;
  }

  /** Get a voice from this section. Returns undefined if off or not in this music section */
  public getVoice(channel: string): Voice | undefined {
    if (!this.voicesMask[channel]) {
      return undefined;
    }
    return this.voices[channel];
  }

  public getPrevVoice(channel: string): Voice | undefined {
    if (!this.prevSection) {
      return undefined;
    }
    return this.prevSection.getVoice(channel);
  }

  public getNextVoice(channel: string): Voice | undefined {
    if (!this.prevSection) {
      return undefined;
    }
    return this.prevSection.getVoice(channel);
  }

  public build() {
    for (const v of Object.keys(this.voices)) {
      this.voices[v].build();
    }
  }

  public getNoteEvents(voicesMask?: {
    [key: string]: boolean;
  }): { [key: string]: NoteEvent[] } {
    const mask = voicesMask ? voicesMask : this.voicesMask;
    const channels: { [key: string]: NoteEvent[] } = {};
    const waits: NoteEvent[] = [];
    // Make array of "rest" note events
    for (const c of this.chordProgression) {
      waits.push(
        new NoteEvent({
          pitch: ['C1'],
          duration: '0',
          wait: c.getDuration(),
          velocity: 0,
        }),
      );
    }

    for (const channel of Object.keys(this.voices)) {
      if (mask[channel]) {
        channels[channel] = this.voices[channel].toNoteEvents();
      } else {
        channels[channel] = waits;
      }
    }
    return channels;
  }
}
