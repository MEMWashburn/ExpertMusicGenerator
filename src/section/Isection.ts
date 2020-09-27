import { NoteDuration } from "src/musical_constructs";
import { Mark } from "src/musical_constructs";

/**
 * ISection describes classes that represent a vertical portion of a song composition.
 * A section would handle all voices' rhythm and note pattern for its duration.
 * It returns an array of Marks for each voice.
 */
export interface ISection {
  getMarks(voicesMask?: {
    [key: string]: boolean;
  }): { [key: string]: Mark[] };
  /**
   * Gets the full duration of each voice
   */
  getDurations(): {[key: string]: NoteDuration | NoteDuration[]};
}
