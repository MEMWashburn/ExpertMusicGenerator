import { Song } from './song';
import * as Tone from 'tone';
import { GMInstruments } from './musicKB';
import { Writer } from 'midi-writer-js';
import { Note } from 'tonal';
import { Composition, TimePeriod } from './composition';
import { BitString } from './BitString';

const Soundfont = require('soundfont-player');

const Midi = require('@tonejs/midi').Midi;

class MusicGeneratorService {
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
  private renderSong(song: Song): Writer {
    return song.getMidi();
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
    console.log(context);
    const instrument = await new Promise<any>((resolve) =>
      Soundfont.instrument(context, name).then((instr: any) => {
        resolve(instr);
      })
    );
    return new Tone.Sampler(instrument.buffers);
  }

  /** Starts playing the given song. Any currently playing song will be stopped. */
  public async playSong(song: Song) {
    console.log('Song: ' + song.getName() + ' playing...');
    console.log(song);

    const write = this.renderSong(song);
    const midi = new Midi(write.buildFile());
    // Stop and destroy old (no pause feature currently)
    this.stopSong();
    this.playing = song;

    // console.log(midi);
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
        // console.log(note.duration);
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
    const write = this.renderSong(song);
    const uri = write.dataUri();
    const link = document.createElement('a');

    link.href = uri;
    link.download = song.getName() + '.mid';
    link.click(); // this will start a download of the MIDI byte string as a file called "music.mid"
  }

  /** Stops playing any song that is current playing  */
  public stopSong() {
    if (!this.playing) {
      return;
    }
    console.log('Song: ' + this.playing.getName() + ' stopped...');
    Tone.Transport.stop();
    this.synths.forEach((s) => {
      s.dispose();
    });
    this.synths = [];
    this.playing = undefined;
  }
}

class PsuedoSong {
  private _comp: Composition;

  constructor(comp: Composition) {
    this._comp = comp;
  }

  public getName() {
    return 'Psuedo Song';
  }

  public getMidi() {
    return this._comp.getMidi(this.getName());
  }
}

const mgs = new MusicGeneratorService();
(window as any).mgs = mgs;
const seed = new BitString();
for (let i = 0; i < 8 * 20; i++) {
  seed.addBit(Math.random() > 0.5 ? 1 : 0);
}

window.onload = function() {
    const context = new AudioContext();
    // One-liner to resume playback when user interacted with the page.
    (document as any).querySelector('button').addEventListener('click', () => {
        context.resume().then(() => {
        console.log('Playback resumed successfully');
        const arousal = parseFloat((document as any).querySelector('#Arousal').value);
        const valence = parseFloat((document as any).querySelector('#Valence').value);
        const myComp = new Composition(arousal, valence, TimePeriod.Present, seed);
        const pSong = new PsuedoSong(myComp);
        mgs.playSong(pSong as any);
        });
    });
};

