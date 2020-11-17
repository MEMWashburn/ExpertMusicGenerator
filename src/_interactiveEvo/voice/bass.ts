import { Mark, Convert } from "../../musical_constructs";
import { ChordDirective } from "../section/chordSection";

export function chordsToBass1(chords: ChordDirective[]): Mark[] {
  const marks: Mark[] = [];
  chords.forEach(chord => {
    const notes = Convert.Chord.To.Notes(chord.chordInfo, 2);
    if (!notes[0]) {
      console.log("WIERD: ", chord, notes);
    }
    marks.push({
      pitch: notes[0],
      duration: chord.dur,
    });
  });

  return marks;
}
