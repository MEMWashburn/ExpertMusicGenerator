
/** A class representing grammars (context-free, contextual) accepts data in the form of JSON.
 *  Follows the same JSON syntax Tracery uses. (http://www.tracery.io/)
 */
export class Grammar {
  /** Function that generates random numbers. Math.random used by default */
  private rng: Function;
  /** Seed, a string of numbers, can be used in place of a random function returning numbers */
  private seed?: { nums: number[]; index: number };
  /** The JSON object defining grammar rules.
   *  Example:
   *  {
   *    origin: [
   *      '#stable# #P# #S# #Dom#',
   *      '#stable# #Dom# #S# #P#',
   *      '#stable# #S# #Dim# #Dom#',
   *      '#stable# #P# #S# #P#',
   *    ],
   *    stable: ['1'],
   *    P: ['1', '4', '5'],
   *    S: ['2', '3', '6'],
   *    Dom: ['5'],
   *    Dim: ['7'],
   *  }
   */
  private rules: { [key: string]: string[] };

  constructor(rules: { [key: string]: string[] }, settings?: { rng?: Function; seed: number[] }) {
    this.rng = Math.random;
    this.rules = rules;

    if (settings) {
      this.rng = settings.rng ? settings.rng : this.rng;
      this.seed = settings.seed ? { nums: settings.seed, index: 0 } : this.seed;
    }
  }

  /** Evaluates a string containing accepted patters. If non-terminals are found they are expanded using
   *  the rules provided when the Grammar was constructed.
   */
  public eval(pattern: string): string {
    let out = pattern;
    let toReplace = out.match(/#\w+#/);

    while (toReplace !== null) {
      for (const repl of toReplace) {
        const key: string = repl.replace(/#/g, '').trim();
        out = out.replace(repl, this.getSingleReplacement(key));
      }
      toReplace = out.match(/#\w+#/);
    }

    return out;
  }

  private getSingleReplacement(key: string): string {
    const options = this.rules[key];
    // skip selection if there is a single choice
    if (options.length === 1) {
      return options[0];
    }
    let pick = 0;
    if (this.seed) {
        pick = this.seed.nums[this.seed.index];
        this.seed.index += 1;
        this.seed.index = this.seed.index % this.seed.nums.length;
    } else {
        pick = Math.floor(this.rng() * options.length);
    }

    return options[pick % options.length];
  }
}
