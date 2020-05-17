import { NoteDuration } from "src/musical_constructs";
import { TNote } from "src/musical_constructs";

/**
 * ISection describes classes that represent a portion of a song.
 * A section would handle all voices' rhythm and note pattern for its duration.
 * It returns an array of notes for each voice.
 */
export interface ISection {
  getNotes(voicesMask?: {
    [key: string]: boolean;
  }): { [key: string]: TNote[] };
  /**
   * Gets the full duration of the section
   */
  getDuration(): NoteDuration | NoteDuration[];
}
