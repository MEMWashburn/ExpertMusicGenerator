import { ISection } from "../section";
import { SectionalComposer } from "../composition";

export class OldComposer extends SectionalComposer {
  data: { [key: string]: any } = {};
  sections: ISection[] = [];
  createMidiData(name?: string | undefined): string {
    throw new Error("Method not implemented.");
  }
}
