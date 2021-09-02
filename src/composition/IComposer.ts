/**
 * IComposer describes classes that compose full songs returning them as base64 encoded midi
 */
export interface IComposer {
  /** contains any data to share */
  data: { [key: string]: any };
  /**
   * Returns the midi representation of the generated song composition
   * @param name optional name for the midi song
   * @return base64 string representation of midi song data
   */
  createMidiData(name?: string): string;
}
