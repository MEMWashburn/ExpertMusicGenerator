import { Voice, Notes } from './voice';
import {
  NoteDuration,
  NoteDurSubdivisions,
  NoteDensityValue,
  NumOfQuarters,
} from './musicKB';
import { Chord } from './chord';
import { Scale, interval, Interval } from 'tonal';
import { NoteEvent } from 'midi-writer-js';

export class Melody extends Voice {
  /** Rhythm pattern per chord duration */
  private rhythm: Array<NoteDuration[]> = [];

  public build() {
    // All logic to construct melody info
    this.decideRhythm();
    this.decideNotePattern();
  }

  private decideRhythm() {
    // Initialize rhythms
    this.rhythm = [];
    const numOfQuarter: number[] = [];

    this.chordProgression.forEach(c => {
      this.rhythm.push([c.getDuration()]);
      const val = NumOfQuarters.get(c.getDuration());
      numOfQuarter.push(val ? val : 1);
    });

    let thresholdsMet = false;
    let tries = 0;
    const arousalBPM = this.comp.getContext().arousalInBPM;
    const arousal = this.comp.getContext().arousal;
    const maxrange = 29 * arousal * arousal;
    const densityWindow = 10 * arousal * arousal;
    const densityThreshold = (maxrange - densityWindow) + densityWindow * arousalBPM;

    while (tries++ < 15 && !thresholdsMet) {
      thresholdsMet = true;
      this.rhythm.forEach((chordRhythm, i) => {
        const info = this.noteDurInfo(chordRhythm);
        const density = info.density / numOfQuarter[i];

        if (density < densityThreshold) {
          thresholdsMet = false;
          // subdivide
          const index = info.indexOfLargestDur;
          const subDivOptions = NoteDurSubdivisions.get(chordRhythm[index]);

          if (subDivOptions) {
            const subDivRhythm =
              subDivOptions[this.numGen.nextNum() % subDivOptions.length];
            chordRhythm.splice(index, 1, ...subDivRhythm);
          }
        }
      });
    }

    // Repeat the first two chord progression's rhythms throughout if arousal sufficiently high
    if (arousal > 0.55) {
      const rhythmOne = this.rhythm[0];
      const rhythmTwo = this.rhythm[1];
      this.rhythm.forEach((chordRhythm, i) => {
        this.rhythm[i] = i % 2 === 0 ? rhythmOne : rhythmTwo;
      });
    }
  }

  private noteDurInfo(durs: NoteDuration[]) {
    let density = 0;
    let minVal = 1000;
    let indices: number[] = [];
    durs.forEach((dur, i) => {
      const val = NoteDensityValue.get(dur);
      density += val ? val : 0;
      if (val && val < minVal) {
        minVal = val;
        indices = [];
        indices.push(i);
      } else if (val && val === minVal) {
        indices.push(i);
      }
    });
    let index = indices[0];
    if (indices.length > 1) {
      index = indices[this.numGen.nextNum() % indices.length];
    }
    return { density: density, indexOfLargestDur: index };
  }

  private decideNotePattern() {
    let totalNotes = 0;
    this.rhythm.forEach(r => {
      totalNotes += r.length;
    });
    let curNote = 0;
    const lastPitches: string[] = [];
    for (let c = 0; c < this.chordProgression.length; c++) {
      const chord = this.chordProgression[c];
      const durations = this.rhythm[c];
      const sequence: Notes[] = [];
      durations.forEach(dur => {
        const p = this.pickPitch(curNote / totalNotes, lastPitches, chord);
        lastPitches[1] = lastPitches[0];
        lastPitches[0] = p;
        sequence.push({
          octave: parseInt(p.slice(p.length - 1), 10),
          pitchClass: p.slice(0, p.length - 1),
          pitch: p,
          duration: dur,
          wait: NoteDuration.zero,
          velocity: 100,
        });
        curNote++;
      });
      this.notes[c] = sequence;
    }
  }

  private pickPitch(
    normPos: number,
    prevPitches: string[],
    chord: Chord,
  ): string {
    const octave =
      typeof this.octave === 'number' ? this.octave : this.octave[0];
    const octave1 = Scale.notes(
      chord.getTonic() + this.octave.toString(),
      chord.getMode(),
    );
    const octave2 = Scale.notes(
      chord.getTonic() + (octave + 1).toString(),
      chord.getMode(),
    );
    const pitches = octave1.concat(octave2);
    if (!prevPitches[0]) {
      return pitches[this.numGen.nextNum() % pitches.length];
    }
    let distribution = new Array(pitches.length).fill(0);

    const ctx = this.comp.getContext();
    const valence = ctx.valence;
    const arousal = ctx.arousal;
    // const valenceMode = ctx.valenceInMode; <- what do?

    // Weights
    const closeW = 2 * (1 - arousal) + 1;
    const farW = 2 * arousal;
    const dissW = 3 * valence;
    const biasW = 2 * arousal + 1;

    // Add close jump distribution
    const closeJump = this.closeJumpDistr(prevPitches[0], pitches);
    distribution = this.combineDistr(1, distribution, closeW, closeJump);

    // Add far jump distribution
    let hasJumped = false;
    let farJump: number[] = [];
    if (prevPitches[1]) {
      farJump = this.farJumpDistr(prevPitches[1], prevPitches[0], pitches);
      hasJumped =
        (farJump.map(v => (v > 0 ? 1 : 0)) as number[]).reduce(
          (a, b) => a + b,
        ) === 2;
      distribution = this.combineDistr(1, distribution, farW, farJump);
    }

    // Add dissonance distribution
    const dissonance = this.dissonanceDistr(chord, pitches);
    distribution = this.combineDistr(1, distribution, dissW, dissonance);

    // Add biased range
    const biasRange = this.biasRangeDistr(normPos, pitches);
    distribution = this.combineDistr(1, distribution, biasW, biasRange);

    // Remove repeating note
    pitches.forEach((p, i) => {
      const intrvl = Interval.num(interval(prevPitches[0], p).toString());
      const dist = Math.abs(intrvl ? intrvl : 0);
      if (dist === 1) {
        distribution[i] = 0;
      }
    });

    // Force 2nd interval jump if farJump occured
    if (hasJumped) {
      farJump
        .map(v => (v > 0 ? 1 : 0))
        .forEach((v, i) => {
          if (v !== 1) {
            distribution[i] = 0;
          }
        });
    }

    // Normalize
    const normVal = distribution.reduce((a, b) => a + b);
    distribution = distribution.map(x => x / normVal);

    const choice = this.numGen.nextNum() / 255;
    let pitch = pitches[pitches.length - 1];
    let cummalative = 0;
    for (let i = 0; i < pitches.length; i++) {
      cummalative += distribution[i];
      if (choice < cummalative) {
        pitch = pitches[i];
        break;
      }
    }
    return pitch;
  }

  private combineDistr(
    a: number,
    X: number[],
    b: number,
    Y: number[],
  ): number[] {
    const sum = new Array(X.length).fill(0);
    X.forEach((val, i) => {
      sum[i] = a * X[i] + b * Y[i];
    });
    return sum;
  }

  /** Determines the distrubition of a bias for what pitches the note should be within */
  private biasRangeDistr(normPos: number, pitches: string[]): number[] {
    let center = Math.round(
      normPos > 0.5
        ? pitches.length * (1 - normPos) * 2
        : pitches.length * normPos * 2,
    );
    if (center > pitches.length) {
      center = pitches.length;
    } else if (center < 1) {
      center = 1;
    }
    center--;
    const threshold = 4;
    let normVal = 0;
    const distribution = new Array(pitches.length);

    pitches.forEach((p, i) => {
      // Set chances higher for pitches close to prev pitch
      const diff = Math.abs(i - center);
      if (diff <= threshold) {
        const prob = threshold - diff + 1;
        distribution[i] = prob;
        normVal += prob;
      } else {
        distribution[i] = 0;
      }
    });

    normVal = normVal === 0 ? 1 : normVal;
    return distribution.map(x => x / normVal);
  }

  /** Determines the distrubition of what is a good small jump in note pattern */
  private closeJumpDistr(prevPitch: string, pitches: string[]): number[] {
    let normVal = 0;
    const distribution = new Array(pitches.length);

    pitches.forEach((p, i) => {
      const intrvl = Interval.num(interval(prevPitch, p).toString());
      const dist = Math.abs(intrvl ? intrvl : 0);
      // Set chances higher for pitches close to prev pitch
      if (dist <= 3) {
        const prob = dist === 1 ? 0 : 1;
        distribution[i] = prob;
        normVal += prob;
      } else {
        distribution[i] = 0;
      }
    });

    normVal = normVal === 0 ? 1 : normVal;
    return distribution.map(x => x / normVal);
  }

  /** Determines the distrubition of what is a good far jump (or return from it) in note pattern */
  private farJumpDistr(
    prevPrevPitch: string,
    prevPitch: string,
    pitches: string[],
  ): number[] {
    let normVal = 0;
    const distribution = new Array(pitches.length);
    const lastInterval = Interval.num(
      interval(prevPrevPitch, prevPitch).toString(),
    );
    const lastDist = Math.abs(lastInterval ? lastInterval : 0);
    const canJump = lastDist === 2;
    const hasJumped = lastDist > 3;
    const jRange = [4, 7]; // inclusive

    pitches.forEach((p, i) => {
      const intrvl = Interval.num(interval(prevPitch, p).toString());
      const dist = Math.abs(intrvl ? intrvl : 0);
      // Set chances higher for pitches pending jump possiblity
      // Can make a far jump
      if (canJump && dist >= jRange[0] && dist <= jRange[1]) {
        distribution[i] = 1;
        normVal += 1;
      } else if (hasJumped && dist === 2) {
        distribution[i] = 1;
        normVal += 1;
      } else {
        distribution[i] = 0;
      }
    });

    normVal = normVal === 0 ? 1 : normVal;
    return distribution.map(x => x / normVal);
  }

  /** Determines the distrubition of what is a good small jump in note pattern */
  private dissonanceDistr(chord: Chord, pitches: string[]): number[] {
    let normVal = 0;
    const distribution = new Array(pitches.length).fill(0);
    const cNotes = chord.getNotes().map(n => n.slice(0, n.length - 1));
    const useCNotes = this.comp.getContext().valence > 0;

    pitches.forEach((p, i) => {
      const inChord =
        cNotes
          .map(n => {
            const int = Interval.simplify(
              interval(p.slice(0, p.length - 1), n).toString(),
            );
            const dist = Interval.num(int ? int : '8P');
            return dist ? Math.abs(dist) : 0;
          })
          .reduce((a, b) => (b === 1 || a === 1 ? 1 : 0)) === 1;
      // Set chances higher for pitches close to prev pitch
      if (useCNotes === inChord) {
        distribution[i] = 1;
        normVal += 1;
      }
    });

    normVal = normVal === 0 ? 1 : normVal;
    return distribution.map(x => x / normVal);
  }

  //   public toNoteEvents(): NoteEvent[] {
  //     const context = this.comp.getContext();
  //     const arpeggiate: boolean = context.arousal > 0.55;
  //     const noteEvents: NoteEvent[] = [];

  //     for (const chord of this.chordProgression) {
  //       const arp: number[] = [1, 3, 2, 3];
  //       for (let i = 0; i < (arpeggiate ? 8 : 1); i++) {
  //         const notes = chord.getNotes(3);
  //         noteEvents.push(
  //           new NoteEvent({
  //             pitch: arpeggiate
  //               ? notes[arp[i % arp.length] % notes.length]
  //               : notes.slice(1),
  //             wait: arpeggiate ? 0 : NoteDuration.quarter,
  //             duration: arpeggiate ? NoteDuration.eighth : NoteDuration.dotHalf,
  //             velocity: 100,
  //           }),
  //         );
  //       }
  //     }
  //     return noteEvents;
  //   }
}
