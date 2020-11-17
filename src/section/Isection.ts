import { Mark } from "../musical_constructs";

/**
 * ISection describes classes that represent a vertical portion of a song composition.
 * A section would handle all voices' rhythm and note pattern for its duration.
 * It returns an array of Marks for each voice (can be missing).
 *  SectionA |  SectionB |  SectionC
 *   Voice1  |   Voice1  |   Voice1
 *   Voice2  |           |   Voice2
 *   Voice3  |   Voice3  |
 */
export interface ISection {
  getMarks(prevSection: ISection, nextSection: ISection, data?: { [key: string]: any }): { [key: string]: Mark[] };
}
