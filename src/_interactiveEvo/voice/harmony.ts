import { Convert, Mark, NoteDuration } from "../../musical_constructs";
import { ChordDirective } from "../section/chordSection";

export function chordsToHarmony1(chords: ChordDirective[], ctx: any): Mark[] {
  const marks: Mark[] = [];
  const arpeggiate: boolean = ctx.arousal > 0.55;
  chords.forEach((chord) => {
    const notes = Convert.Chord.To.Notes(chord.chordInfo, 5);
    if (!arpeggiate) {
      // sustain chord
      marks.push({
        pitch: undefined,
        rest: true,
        duration: NoteDuration.Quarter,
      });
      const remain = chord.dur.minus(NoteDuration.Quarter);
      marks.push({
        pitch: notes.slice(1),
        duration: remain ? remain : NoteDuration.Quarter,
      });
    } else {
      marks.push({
        pitch: undefined,
        rest: true,
        duration: NoteDuration.Quarter,
      });
      const remain = chord.dur.minus(NoteDuration.Quarter);
      marks.push({
        pitch: notes.slice(1),
        duration: remain ? remain : NoteDuration.Quarter,
      });
    }
  });

  return marks;
}
