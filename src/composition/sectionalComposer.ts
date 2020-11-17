import { Mark, NoteDuration } from "../musical_constructs";
import { ISection } from "../section";
import { IComposer } from "./IComposer";

export abstract class SectionalComposer implements IComposer {
  data = {};
  sections: ISection[] = [];

  getAllMarks(): { [key: string]: Mark[] } {
    const sectData: {
      marks: { [key: string]: Mark[] };
      durs: { [key: string]: NoteDuration };
      max: NoteDuration;
    }[] = [];
    const allVoices = new Set<string>();

    // Go through all sections -> getMarks()
    let prev = this.sections.length - 1;
    let next = 1;
    for (let i = 0; i < this.sections.length; i++) {
      prev = prev % this.sections.length;
      next = next % this.sections.length;
      // get marks
      const marks = this.sections[i].getMarks(
        this.sections[prev],
        this.sections[next],
        this.data
      );

      // annotate returned data
      let max = NoteDuration.Zero; // start at zero
      const durs: { [key: string]: NoteDuration } = {};
      for (const key of Object.keys(marks)) {
        allVoices.add(key);
        const totalDur = NoteDuration.add(
          NoteDuration.Zero,
          NoteDuration.Zero,
          ...marks[key].map((m) => m.duration)
        );
        if (totalDur) {
          durs[key] = totalDur;
          max = totalDur.getValue() > max.getValue() ? totalDur : max;
        } else {
          durs[key] = NoteDuration.Zero;
        }
      }
      sectData.push({
        marks,
        durs,
        max,
      });
      // track prev/next section
      ++prev;
      ++next;
    }

    // create uniform list of all marks for all voices
    const fullMarks: { [key: string]: Mark[] } = {};
    for (const key of allVoices) {
      fullMarks[key] = [];
    }

    for (const data of sectData) {
      for (const key of allVoices) {
        const marks = data.marks[key];
        if (marks) {
          // add voice's notes
          fullMarks[key].push(...marks);
          // add remainder duration if needed
          const diff = NoteDuration.minus(data.max, data.durs[key]);
          if (diff && diff.getValue() > 0) {
            fullMarks[key].push({
              pitch: undefined,
              rest: true,
              duration: diff,
            });
          }
        } else {
          // add rest for duration of other voices
          fullMarks[key].push({
            pitch: undefined,
            rest: true,
            duration: data.max,
          });
        }
      }
    }

    return fullMarks;
  }

  abstract createMidiData(name?: string): string;
}
