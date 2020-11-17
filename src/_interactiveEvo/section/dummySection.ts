import { Mark } from "../../musical_constructs";
import { ISection } from "../../section";

export class DummySection implements ISection {
  _voices: { [key: string]: Mark[] } = {};

  constructor(voices: { [key: string]: Mark[] }) {
    this._voices = voices;
  }

  getMarks(
    prevSection: ISection,
    nextSection: ISection,
    data?: { [key: string]: any }
  ): { [key: string]: Mark[] } {
    return this._voices;
  }
}
