import { GeneticComposer } from "./GeneticComposer";

export class OldComposer extends GeneticComposer {
    createMidiData(name?: string | undefined): string {
        throw new Error("Method not implemented.");
    }
}
