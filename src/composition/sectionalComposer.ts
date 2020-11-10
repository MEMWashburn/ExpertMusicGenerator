import { ISection } from "../section";
import { IComposer } from "./IComposer";

export abstract class SectionalComposer implements IComposer {
  data = {};
  sections: ISection[] = [];
  abstract createMidiData(name?: string): string;
}
