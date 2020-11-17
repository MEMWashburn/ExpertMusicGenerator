import { MusicPlayerService } from "./musicPlayerService";
import { BitString } from "../BitString";
import { Mark, Pitch, NoteDuration } from "../musical_constructs";
import { DummySection } from "./section/dummySection";
import { PhenoComposer } from "./phenoComposer";
import { Genome, toComposition1 } from "./geneticRepMixed";

// Set up midi player
const player = new MusicPlayerService();
(window as any).player = player;

const def_genome = new Genome();
(window as any).gen = def_genome;

// Testing composition
const comp = new PhenoComposer();

const cChord: Pitch[] = [
  { class: "C", octave: 4 },
  { class: "E", octave: 4 },
  { class: "G", octave: 4 },
];
const marks1: Mark[] = [
  { pitch: { class: "E", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "C", octave: 4 }, duration: NoteDuration.Half },
];
const marks2: Mark[] = [
  { pitch: { class: "E", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: cChord, duration: NoteDuration.Half },
];
const marks3: Mark[] = [
  { pitch: { class: "C", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "C", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "C", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "C", octave: 4 }, duration: NoteDuration.Quarter },
];
const marks4: Mark[] = [
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.Quarter },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.Quarter },
];
const markst: Mark[] = [
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
  { pitch: { class: "D", octave: 4 }, duration: NoteDuration.QuarterTriplet },
];
const marks5: Mark[] = [
  { pitch: { class: "C", octave: 2 }, duration: NoteDuration.Whole },
];
const marks6: Mark[] = [
  { pitch: { class: "F", octave: 2 }, duration: NoteDuration.Whole },
];
comp.sections.push(new DummySection({ voice1: marks1, voice2: marks5 }));
comp.sections.push(new DummySection({ voice1: marks1, voice2: marks5 }));
comp.sections.push(new DummySection({ voice1: marks3, voice2: marks6 }));
comp.sections.push(new DummySection({ voice1: marks4, voice2: marks6 }));
comp.sections.push(new DummySection({ voice1: marks2, voice2: marks5 }));

const song = {
  name: "test",
  compRef: comp,
  base64: comp.createMidiData("test"),
};

let curSong = song;

window.onload = () => {
  const context = new AudioContext();
  // One-liner to resume playback when user interacted with the page.
  (document as any)
    .querySelector("#play_button")
    .addEventListener("click", () => {
      context.resume().then(() => {
        console.log("Playback resumed successfully");
        const arousal = parseFloat(
          (document as any).querySelector("#Arousal").value
        );
        const valence = parseFloat(
          (document as any).querySelector("#Valence").value
        );

        let gen = (window as any).gen;
        gen = gen ? gen : def_genome;

        const gComp = toComposition1({ arousal, valence, gen });
        if (gComp) {
          curSong = {
            name: "genetic song",
            compRef: gComp,
            base64: gComp.createMidiData("genetic song"),
          };
          (window as any).curSong = curSong;
          player.playSong(curSong);
        }
      });
    });
  (document as any)
    .querySelector("#stop_button")
    .addEventListener("click", () => {
      player.stopSong();
    });
  (document as any)
    .querySelector("#dwnld_button")
    .addEventListener("click", () => {
      player.downloadSong(curSong);
    });
};
