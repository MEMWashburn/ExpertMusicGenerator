/**
 * IComposer describes classes that compose full songs in midi returning them as base64 encoded strings
 */
export interface IComposer {
  /** contains any data to share */
  data: { [key: string]: any };
  /**
   * Creates the midi data from the generated song composition
   * @param name optional name of the midi song data
   * @return base64 string representation of midi data
   */
  createMidiData(name?: string): string;
}
