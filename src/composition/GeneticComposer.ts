import { IComposer } from "./IComposer";
import { BitString } from "src/BitString";

export abstract class GeneticComposer implements IComposer {

  private _seed: BitString;

  constructor(seed?: BitString) {
    this._seed = seed ? seed : new BitString("00000000");
  }

  abstract createMidiData(name?: string): string;
}

// createMidiData(name?: string): string {
//   return "";
// }
