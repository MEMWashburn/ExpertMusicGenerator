import { BitString, NumberGenerator } from "../../BitString";
import { PhenoComposer } from "../phenoComposer";

const BYTE_LEN = 256;

export class Genome {
  _seed: BitString;
  _defaultRng: NumberGenerator;
  _rngMap: { [key: string]: NumberGenerator } = {};
  _jumpMap: { [key: string]: number } = {};

  constructor(seed?: BitString) {
    this._seed = seed ? seed : BitString.getRandom(8 * BYTE_LEN);
    this._defaultRng = this._seed.getNumberGenerator();
  }

  addRNG(key: string, jump = 1) {
    if (jump <= 0) {
      jump = 1;
    }
    this._rngMap[key] = this._seed.getNumberGenerator();
    this._rngMap[key].nextBit(jump - 1);
    this._rngMap[key].nextNum(jump - 1);
  }

  getBit(key = ""): 0 | 1 {
    let rng = this._rngMap[key];
    if (rng) {
      console.log("[Genome] using key: " + key + " for RNG(bit)");
    }
    rng = rng ? rng : this._defaultRng;
    let jump = this._jumpMap[key];
    jump = jump ? jump : 1;
    return rng.nextBit(jump);
  }

  getNum(key = ""): number {
    let rng = this._rngMap[key];
    if (rng) {
      console.log("[Genome] using key: " + key + " for RNG(byte)");
    }
    rng = rng ? rng : this._defaultRng;
    let jump = this._jumpMap[key];
    jump = jump ? jump : 1;
    return rng.nextNum(jump);
  }

  getPercent(key = ""): number {
    return this.getNum(key) / 256;
  }

}
