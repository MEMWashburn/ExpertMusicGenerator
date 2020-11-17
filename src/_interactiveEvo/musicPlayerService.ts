import * as Tone from "tone";
import { base64ToUInt8Array } from "../util";
import { GMInstruments } from "../musical_constructs";
import { IComposer } from "../composition";

const Soundfont = require("soundfont-player");

const Midi = require("@tonejs/midi").Midi;

export interface Song {
  name: string;
  compRef: IComposer;
  base64: string;
}

export class MusicPlayerService {
  private currentClip?: any;
  private playing?: Song;
  private synths: Tone.Instrument[];
  private instrumentBuffers = new Map<string, any>();

  constructor() {
    this.synths = [];
  }

  /** Returns the song that is currently playing, or undefined if there is no song playing */
  public getPlayingSong() {
    return this.playing;
  }

  /** Converts the user defined parameters for a song into a scribble clip
   *
   * @param song - The song data the user wants to generate
   * @param forDownload - A flag that tells us if the song should be prepared for download as a midi (and not have a synth)
   */
  private renderSong(song: Song): Uint8Array {
    return base64ToUInt8Array(song.base64);
  }

  /** Gets a Tone.JS synth that plays the given instrument.
   * You can find the names of the instruments at https://en.wikipedia.org/wiki/General_MIDI
   */
  private async getInstrumentSynth(name: string) {
    const existing = this.instrumentBuffers.get(name);
    if (existing) {
      return new Tone.Sampler(existing);
    }
    const context = (Tone as any).context;
    const instrument = await new Promise<any>((resolve) =>
      Soundfont.instrument(context, name).then((instr: any) => {
        console.log("Found " + name + " synth!");
        resolve(instr);
      })
    );
    return new Tone.Sampler(instrument.buffers);
  }

  /** Starts playing the given song. Any currently playing song will be stopped. */
  public async playSong(song: Song) {
    console.log("Song: " + song.name + " playing...");

    const songData = this.renderSong(song);
    const midi = new Midi(songData);
    // Stop and destroy old (no pause feature currently)
    this.stopSong();
    this.playing = song;

    // Set up Transport meta data and loop points
    Tone.Transport.bpm.value = midi.header.tempos[0].bpm;
    Tone.Transport.timeSignature = midi.header.timeSignatures[0].timeSignature;
    const delay = 0.1; // Delay song by 0.1s
    const end = midi.duration + delay; // End of rendered song
    Tone.Transport.setLoopPoints(delay, end);
    Tone.Transport.loop = true;

    for (const track of midi.tracks) {
      // create a synth for each track
      console.log(track);
      // const synth = await this.getInstrumentSynth(song.getInstrument());
      const synth = await this.getInstrumentSynth(
        (GMInstruments.byId as any)[track.instrument.number].id
      );
      if (this.playing !== song) {
        return;
      }
      synth.volume.value = 10.0;

      synth.toMaster();
      synth.sync();
      this.synths.push(synth);

      // schedule all of the events
      track.notes.forEach((note: any) => {
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time + delay,
          note.velocity
        );
      });
    }

    if (this.playing === song) {
      Tone.Transport.start();
    }
  }

  /** Download a song as a midi file*/
  public downloadSong(song: Song) {
    const uri = "data:audio/midi;base64," + song.base64;
    const link = document.createElement("a");

    link.href = uri;
    link.download = song.name + ".mid";
    link.click(); // this will start a download of the MIDI byte string as a file
  }

  /** Stops playing any song that is current playing  */
  public stopSong() {
    if (!this.playing) {
      return;
    }
    console.log("Song: " + this.playing.name + " stopped...");
    Tone.Transport.stop();
    this.synths.forEach((s) => {
      s.dispose();
    });
    this.synths = [];
    this.playing = undefined;
  }
}
