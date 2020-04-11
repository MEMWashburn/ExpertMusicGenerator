import { Section } from './section';
import { Composition } from './composition';
import { Chord } from './chord';
import { NumberGenerator } from './BitString';
import { NoteDuration } from './musicKB';
import { PitchClass } from 'tonal-distance';
import { NoteEvent } from 'midi-writer-js';

export type VConstructor = new (
  comp: Composition,
  section: Section,
  chordProgression: Chord[],
  numGen?: NumberGenerator,
) => Voice;

export interface Notes {
  pitch: string | string[];
  octave: number | number[];
  pitchClass: PitchClass | PitchClass[];
  duration: NoteDuration;
  wait:  NoteDuration;
  velocity: number;
}

/** Abstract class for voices such as melody, bass, and harmony line */
export abstract class Voice {
  /** The octave of octave range the voice is in. */
  protected octave: number | number[] = 4;
  /** NumberGenerator to access seeded random nums */
  protected numGen: NumberGenerator;
  /** Notes per chord in chord progression */
  protected notes: Array<Notes[]> = [];
  constructor(
    /** The composition class section is contained in. To access global info */
    protected comp: Composition,
    /** The section the voice resides in */
    protected section: Section,
    /** List of chords outlining the section */
    protected chordProgression: Chord[],
    /** NumberGenerator to access seeded random nums */
    numGen?: NumberGenerator,
  ) {
    this.numGen = numGen ? numGen : new NumberGenerator();
    for (let c = 0; c < chordProgression.length; c++) {
      this.notes.push([]);
    }
  }

  public abstract build(): void;

  /** General building of noteEvent array for midi creation */
  public toNoteEvents(): NoteEvent[] {
    const events: NoteEvent[] = [];
    this.notes.forEach(nts => {
      nts.forEach(n => {
        events.push(new NoteEvent ({
          pitch: n.pitch,
          duration: n.duration,
          wait: n.wait,
          velocity: n.velocity,
        }));
      });
    });
    return events;
  }
}
