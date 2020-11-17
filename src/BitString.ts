export class    NumberGenerator {
  private useRandom = false;
  private bitIndex = 0;
  private numIndex = 0;
  private bits: Array<0 | 1> = [];
  private nums: Array<number> = [];

  constructor(bStr?: BitString) {
    if (bStr) {
      this.bits = bStr.toBitArray();
      this.nums = bStr.toByteArray();
    }
    if (this.bits.length === 0 || this.nums.length === 0) {
      this.useRandom = true;
    }
  }

  /** Gets next bit. If jump provided increments index by jump value else by 1 */
  public nextBit(jump?: number): 0 | 1 {
    if (this.useRandom) {
      return Math.random() > 0.5 ? 1 : 0;
    }
    const bit = this.bits[this.bitIndex];
    this.bitIndex = (this.bitIndex + (jump ? Math.round(jump) : 1)) % this.bits.length;
    return bit;
  }

  /** Gets next number. If jump provided increments index by jump value else by 1 */
  public nextNum(jump?: number) {
    if (this.useRandom) {
      return Math.floor(Math.random() * 256);
    }
    const num = this.nums[this.numIndex];
    this.numIndex = (this.numIndex + (jump ? Math.round(jump) : 1)) % this.nums.length;
    return num;
  }
}

export class BitString {
  private data: Array<0 | 1> = [];

  /**
   * get random length bitstring
   * @param length length in bits
   */
  static getRandom(length: number): BitString {
    const bs = new BitString();
    for (let i = 0; i < length; i++) {
      bs.addBit(Math.random() > 0.5 ? 1 : 0);
    }
    return bs;
  }

  constructor(str?: string) {
    if (str) {
      this.fromString(str);
    }
  }

  /** Flips each bit with the given probability
   * @param mutationChance - The chance a bit will mutate, must be a number between 0 and 1
   */
  public mutate(mutationChance: number) {
    if (mutationChance < 0 || mutationChance > 1) {
      throw new Error("Mutation chance is not a valid probability");
    }
    for (let i = 0; i < this.data.length; i++) {
      if (Math.random() < mutationChance) {
        this.data[i] = this.data[i] === 0 ? 1 : 0;
      }
    }
  }

   /** Returns a new string that is the crossover of the two bitstrings at a number of points
   * Initially, bits come from this string. Whenever a crossover point is hit, the source of the bits changes to the other string.
   * If one of the two parents is longer than the other,
   * bits after the length of the shorter parent will come exclusivly from the longer parent.
   * @param bitstring - The other bitstring to combine with this one
   * @param points - The number of crossover points to use, defaults to 1
   */
  public crossover(bitstring: BitString, points: number = 1) {
    const size = Math.min(bitstring.data.length, this.data.length);
    if (points < 1 || points >= size) {
      throw new Error("Invalid number of crossover points");
    }

    const crossoverPoints = new Set<number>();
    while (crossoverPoints.size < points) {
      crossoverPoints.add(Math.floor(Math.random() * size));
    }

    let source = 0;
    const sources = [[this.data, bitstring.data], [bitstring.data, this.data]];
    const results = [new BitString(), new BitString()];
    for (let src = 0; src < 2; src++) {
      for (let i = 0; i < sources[src][0].length; i++) {
        if (crossoverPoints.has(i)) {
          source = source === 0 ? 1 : 0;
        }
        if (sources[source].length > i) {
          results[src].data[i] = sources[src][source][i];
        } else {
          results[src].data[i] = sources[src][0][i];
        }
      }
    }
    return results;
  }



  public toString() {
    return this.data.map(bit => bit.toString()).join("");
  }

  public addBit(bit: 0 | 1) {
    this.data.push(bit);
  }

  public fromString(str: string) {
    this.data = [];
    for (const char of str) {
      if (char === "1") {
        this.data.push(1);
      } else if (char === "0") {
        this.data.push(0);
      }
    }
  }

  public toBitArray(): Array<0 | 1> {
    return [...this.data];
  }

  public toByteArray(): number[] {
    const numBytes = Math.ceil(this.data.length / 8);
    const bytes: number[] = new Array(numBytes).fill(0);
    for (let i = 0; i < numBytes; i++) {
      const byteLenth = Math.min(8, this.data.length - i * 8);
      for (let j = 0; j < byteLenth; j++) {
        const bit = this.data[i * 8 + j];
        if (bit === 1) {
          // tslint:disable-next-line: no-bitwise
          bytes[i] = (1 << (byteLenth - 1 - j)) | bytes[i];
        }
      }
    }
    return bytes;
  }

  /** Returns a seeded number generator based on BitString */
  public getNumberGenerator(): NumberGenerator {
    return new NumberGenerator(this);
  }
}

// Is the distrubution even
// const NUMS = 10000;
// const bs = BitString.getRandom(8 * NUMS);
// const dist: any = {};
// bs.toByteArray().forEach(v => {
//   dist[v] = dist[v] ? dist[v] + 1 : 1;
// });
// Object.keys(dist).forEach(v => {
//   console.log(v + "\t: " + (dist[v] / NUMS * 100).toFixed(2) + "%\t\t| (0.39%)");
// });
