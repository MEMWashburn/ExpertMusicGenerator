import { Voice } from './voice';
import { NoteDuration } from './musicKB';
import { NoteEvent } from 'midi-writer-js';

export class Bass extends Voice {
  public build() {
    // All logic to construct bass info\
    // Currently no additional logic
  }

  public toNoteEvents(): NoteEvent[] {
    const noteEvents: NoteEvent[] = [];

    for (const chord of this.chordProgression) {
        const notes = chord.getNotes(2);
        noteEvents.push(
          new NoteEvent({
            pitch: notes[0],
            duration: chord.getDuration(),
            velocity: 70,
          }),
        );
    }
    return noteEvents;
  }
}
