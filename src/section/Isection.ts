import { NoteDuration } from "src/musical_constructs";
import { Mark } from "src/musical_constructs";

/**
 * ISection describes classes that represent a vertical portion of a song composition.
 * A section would handle all voices' rhythm and note pattern for its duration.
 * It returns an array of Marks for each voice.
 *  SectionA |  SectionB |  SectionC
 *   Voice1  |   Voice4  |   Voice7
 *   Voice2  |   Voice5  |   Voice8
 *   Voice3  |   Voice6  |   Voice9
 */
export interface ISection {
  getMarks(prevSection: ISection, nextSection: ISection): { [key: string]: Mark[] };
  /**
   * Gets the full duration of each voice
   */
  getDurations(): {[key: string]: NoteDuration | NoteDuration[]};
}
