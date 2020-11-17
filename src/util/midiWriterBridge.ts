import {
  Mode,
  Mark,
  NoteDuration,
  Pitch,
  PitchClass,
  TimeSignature,
  Convert,
} from "../musical_constructs";
import { Scale } from "@tonaljs/tonal";
import { Track, NoteEvent, ProgramChangeEvent, Writer } from "midi-writer-js";

// Converts music constructs to equivalents for github.com/grimmdude/MidiWriterJS

export function toDuration(dur: NoteDuration): string {
  return "t" + Math.round(dur.getValue() * 4 * 128);
}

export function toPitch(pitch: Pitch): string {
  return pitch.class + pitch.octave;
}

function _markToNoteEvent(mark: Mark): NoteEvent | undefined {
  if (mark.rest) {
    // Is a rest
    return new NoteEvent({
      pitch: "C4", // <- we don't care
      duration: "0",
      wait: toDuration(mark.duration),
      velocity: 0, // <- just in case
    });
  } else if (mark.pitch) {
    // is actual note
    return new NoteEvent({
      pitch: Array.isArray(mark.pitch)
        ? mark.pitch.map((p) => toPitch(p))
        : toPitch(mark.pitch),
      duration: toDuration(mark.duration),
      velocity: 100,
    });
  } // Other?

  // never reach
  return undefined;
}

function _addMarks(track: Track, channel: number, marks: Mark[]) {
  for (const mark of marks) {
    track.addEvent(_markToNoteEvent(mark), (index: any, event: any) => {
      return { channel };
    });
  }
}

export function createBase64Midi(
  metaData: {
    name?: string;
    timeSig?: TimeSignature;
    tonic?: PitchClass;
    mode?: Mode;
    intruments?: { [key: string]: number };
  },
  marks: { [key: string]: Mark[] }
): string {
  const tracks: Track[] = [];
  // Create midi meta data
  const dataTrack: Track = new Track();

  dataTrack.addTrackName(metaData.name ? metaData.name : "My Song");

  // Try to find and set key signature
  if (metaData.tonic && metaData.mode) {
    for (const scales of Scale.modeNames(
      metaData.tonic + " " + metaData.mode
    )) {
      if (scales[1] === "major") {
        dataTrack.setKeySignature(scales[0], undefined);
        break;
      }
    }
  }

  // Set time signature and bpm
  if (metaData.timeSig) {
    dataTrack.setTempo(metaData.timeSig.bpm);
    dataTrack.setTimeSignature(
      metaData.timeSig.numerator,
      metaData.timeSig.denominator
    );
  }

  // Create note channels
  const channels: Track[] = [];
  let channelNum = 0;

  for (const voice of Object.keys(marks)) {
    const track = new Track();
    ++channelNum;
    track.addTrackName(voice);
    track.addEvent(
      new ProgramChangeEvent({
        instrument:
          metaData.intruments && metaData.intruments[voice] !== undefined
            ? metaData.intruments[voice]
            : 0,
      })
    );
    console.log(`adding voice: ${voice} `, marks[voice]);
    _addMarks(track, channelNum, marks[voice]);
    channels.push(track);
  }

  // Assemble voice tracks for midi file
  tracks.push(dataTrack);
  for (const channel of channels) {
    tracks.push(channel);
  }

  const write = new Writer(tracks);

  return write.base64();
}
