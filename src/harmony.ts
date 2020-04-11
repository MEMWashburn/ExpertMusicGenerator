import { Voice } from './voice';
import { NoteDuration, ChordType } from './musicKB';
import { NoteEvent } from 'midi-writer-js';

export class Harmony extends Voice {
  public build() {
    // All logic to construct harmony info
    // Currently no additional logic
  }

  public toNoteEvents(): NoteEvent[] {
    const context = this.comp.getContext();
    const arpeggiate: boolean = context.arousal > 0.55;
    const noteEvents: NoteEvent[] = [];

    for (const chord of this.chordProgression) {
      const arp: number[] = [1, 2, 3];
      for (let i = 0; i < (arpeggiate ? 3 : 1); i++) {
        const notes = chord.getNotes(3);
        noteEvents.push(
          new NoteEvent({
            pitch: arpeggiate
              ? notes[arp[i % arp.length] % notes.length]
              : notes.slice(1),
            wait: arpeggiate && i !== 0 ? 0 : NoteDuration.quarter,
            duration: arpeggiate ? NoteDuration.quarter : NoteDuration.dotHalf,
            velocity: 75,
          }),
        );
      }
    }
    return noteEvents;
  }
}
