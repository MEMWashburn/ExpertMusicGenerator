/**
 * ISection describes classes that represent a portion of a song.
 * A section would handle all voices' rhythm and note pattern for its duration.
 * It returns an array of notes for each voice.
 */
export interface ISection {
  /**
   * Creates the midi data from the generated song composition
   * @param name optional name of the midi song data
   * @return base64 string representation of midi data
   */
  createMidiData(name?: string): string;
}
