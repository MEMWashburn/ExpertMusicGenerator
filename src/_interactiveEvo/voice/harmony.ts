import { Convert, Mark, Pitch, NoteDuration } from "../../musical_constructs";
import { ChordDirective } from "../section/chordSection";

export function chordsToHarmony1(
  chords: ChordDirective[],
  ctx: any,
  rng_prob: () => number = Math.random
): Mark[] {
  const marks: Mark[] = [];
  const arpeggiate: boolean = ctx.arousal > 0.45;
  chords.forEach((chord) => {
    const notes = Convert.Chord.To.Notes(chord.chordInfo, 3);
    if (!arpeggiate) {
      marks.push({
        pitch: notes.slice(1),
        duration: chord.dur,
      });
    } else {
      createArpeggio(chord, ctx.arousal < 0.75 ? NoteDuration.Quarter : NoteDuration.Eighth, rng_prob).forEach((m) => {
        marks.push(m);
      });
    }
  });

  return marks;
}

function createArpeggio(
  chord: ChordDirective,
  subDiv: NoteDuration,
  rng_prob: () => number = Math.random
) {
  const notes = Convert.Chord.To.Notes(chord.chordInfo, 3);
  let cpy = [...notes];
  const buckets = Math.round(chord.dur.getValue() / subDiv.getValue());
  const beats: { [key: number]: Pitch[] } = {};
  for (let b = 0; b < buckets; b++) {
    if (cpy.length === 0) {
      cpy = [...notes];
    }
    if (!beats[b]) {
      beats[b] = [];
    }
    const pick = Math.floor(Math.min(rng_prob(), 0.99999) * cpy.length);
    beats[b].push(cpy.splice(pick)[0]);
  }
  cpy.forEach((p) => {
    const place = Math.floor(Math.min(rng_prob(), 0.99999) * buckets);
    beats[place].push(p);
  });
  const marks: Mark[] = [];
  for (let b = 0; b < buckets; b++) {
    marks.push({
      pitch: beats[b],
      duration: subDiv,
    });
  }
  return marks;
}
