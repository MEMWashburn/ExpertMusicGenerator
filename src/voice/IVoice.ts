import { NoteDuration } from "src/musical_constructs";
import { Mark } from "src/musical_constructs";

/**
 * IVoice describes classes that represent a horizontal portion of a song composition.
 * Found within a Section.
 *  SectionA |  SectionB |  SectionC
 *   Voice1  |   Voice4  |   Voice7
 *   Voice2  |   Voice5  |   Voice8
 *   Voice3  |   Voice6  |   Voice9
 */
export interface IVoice {
  getMarks(): Mark[];
  /**
   * Gets the full duration of voice voice
   */
  getDuration(): NoteDuration | NoteDuration[];
}
