import * as uuid from 'uuid';
import { EditableObject } from './editableObject';
import { BitString } from './BitString';
import { TimePeriod, Composition } from './composition';
import { GMInstruments } from './musicKB';
import {Writer} from 'midi-writer-js';

export enum SongTheme {
  UseParent = 'Use Project Theme',
  SciFi = 'Science Fiction',
  Fantasy = 'Fantasy',
  Horror = 'Horror',
}

/** A project cannot set its MusicTheme to be "Use Parent" so it has this type */
export type ProjectTheme = Exclude<SongTheme, SongTheme.UseParent>;

export enum SongType {
  Menu = 'Menu',
  Exploration = 'Exploration',
  Combat = 'Combat',
  Boss = 'Boss',
}

/** Interface that represents the internal data of a Song when it is stored as JSON */
export interface SongData {
  id: string;
  name: string;
  created: string;
  lastEdited: string;

  theme: SongTheme;
  type: SongType;
  energy: number;
  tone: number;
  seed: string;
}

/** A class representing the information needed to generate a song */
export class Song extends EditableObject {
  /** The theme of the song such as Fantasy or Sci-Fi */
  private theme: SongTheme;
  /** The type of role the song will play inside a game such as Exploration or Combat music */
  private type: SongType;
  /** The user energy adjustment */
  private energy: number;
  /** The user valence adjustment (called "tone")
   *
   * Valence, as used in psychology, especially in discussing emotions, means the intrinsic attractiveness/"good"-ness
   * (positive valence) or averseness/"bad"-ness (negative valence) of an event, object, or situation.
   */
  private tone: number;

  /** A bitstring used to control the random parts of song generation */
  private seed: BitString;

  /** Constructs a project. If a data source is provided the project will load that. Otherwise, it will create a new project */
  constructor(data?: SongData) {
    super();
    this.id = data ? data.id : uuid();
    this.name = data ? data.name : 'New Song';
    this.created = data ? new Date(data.created) : new Date();
    this.lastEdited = data ? new Date(data.lastEdited) : new Date();
    this.theme = data ? data.theme : SongTheme.UseParent;
    this.type = data ? data.type : SongType.Menu;
    this.energy = data ? data.energy : 0;
    this.tone = data ? data.tone : 0;
    this.seed = data ? new BitString(data.seed) : new BitString();
    if (!data) {
      this.randomizeSeed();
    }
  }

  /** Converts the class into a simple object that can be saved as JSON */
  public toData(): SongData {
    this.modified = false;
    return {
      id: this.id,
      name: this.name,
      created: this.created.toString(),
      lastEdited: this.lastEdited.toString(),
      theme: this.theme,
      type: this.type,
      energy: this.energy,
      tone: this.tone,
      seed: this.seed.toString(),
    };
  }

  /** Converts the user defined parameters for a song into midi data via MidiWriter */
  public getMidi(): Writer {
    console.log('My seed is: ' + this.seed.toString());
    console.log('In 1 byte number: ' + this.seed.toByteArray().toString());
    console.log('## Composition ##');
    const comp = new Composition(
      this.getResolvedArousal(),
      this.getResolvedValence(),
      this.getResolvedTimePeriod(),
      this.seed,
    );
    console.log(comp);
    return comp.getMidi(this.getName());
  }

  /** Gets the song's base theme (may be use parent theme, which is not valid for song generation).
   * If you want the theme that should be used for generation, use the getResolvedTheme() method.
   */
  public getTheme() {
    return this.theme;
  }

  /** Gets the songs resolved theme. If the song uses its parent's theme, that will be returned*/
  public getResolvedTheme(): ProjectTheme {
    if (this.theme === SongTheme.UseParent) {
      return SongTheme.Fantasy;
    }
    return this.theme;
  }

  public setTheme(theme: SongTheme) {
    if (theme !== this.theme) {
      this.theme = theme;
      this.markChange();
    }
  }

  /** Gets the type of role the song will play inside a game such as Exploration or Combat music */
  public getType() {
    return this.type;
  }

  /** Sets the type of role the song will play inside a game such as Exploration or Combat music */
  public setType(type: SongType) {
    if (type !== this.type) {
      this.type = type;
      this.markChange();
    }
  }

  public markChange() {
    super.markChange();
  }

  /** Sets the user energy adjustment for this song */
  public setEnergy(energy: number) {
    if (energy !== this.energy) {
      this.energy = energy;
      this.markChange();
    }
  }

  /** Gets the user set energy adjustment for this song (this should not be used for generation) */
  public getEnergy() {
    return this.energy;
  }

  /**
   * Sets the Valence of the song (labeled tone)
   *
   * Valence, as used in psychology, especially in discussing emotions, means the intrinsic attractiveness/"good"-ness
   * (positive valence) or averseness/"bad"-ness (negative valence) of an event, object, or situation.
   */
  public setTone(tone: number) {
    if (tone !== this.tone) {
      this.tone = tone;
      this.markChange();
    }
  }

  /**
   * Returns the Valence of the song
   *
   * Valence, as used in psychology, especially in discussing emotions, means the intrinsic attractiveness/"good"-ness
   * (positive valence) or averseness/"bad"-ness (negative valence) of an event, object, or situation.
   */
  public getTone() {
    return this.tone;
  }

  /** Gets the amount of arousal associated with this song's theme */
  private getThemeArousal() {
    switch (this.getResolvedTheme()) {
      case SongTheme.SciFi:
        return 0.2;
      case SongTheme.Fantasy:
        return 0.5;
      case SongTheme.Horror:
        return 0.35;
    }
    return 0;
  }

  /** Gets the amount of arousal associated with this song's type */
  private getTypeArousal() {
    switch (this.getType()) {
      case SongType.Boss:
        return 0.9;
      case SongType.Combat:
        return 0.75;
      case SongType.Exploration:
        return 0.45;
      case SongType.Menu:
        return 0.2;
    }
  }

  /** Gets the total amount of arousal of this song based on its theme, type, and user adjustment */
  public getResolvedArousal() {
    let calcArousal =
      (this.energy / 100) * 0.15 + this.getThemeArousal() + this.getTypeArousal() / 2;
    if (calcArousal < 0) {
      calcArousal = 0;
    }
    if (calcArousal >= 1) {
      calcArousal = 0.999;
    }
    return calcArousal;
  }

  /** Gets the valence associated with this song's theme */
  private getThemeValence() {
    switch (this.getResolvedTheme()) {
      case SongTheme.SciFi:
        return 0.2;
      case SongTheme.Fantasy:
        return 0.7;
      case SongTheme.Horror:
        return -0.7;
    }
    return 0;
  }

  /** Gets the valence associated with this song's type */
  private getTypeValence() {
    switch (this.getType()) {
      case SongType.Boss:
        return -0.7;
      case SongType.Combat:
        return -0.4;
      case SongType.Exploration:
        return 0.6;
      case SongType.Menu:
        return 0.3;
    }
  }

  /** Gets the total amount of valence of this song based on its theme, type, and user adjustment */
  public getResolvedValence() {
    let calcValence =
      (this.tone / 100) * 0.3 + this.getThemeValence() + this.getTypeValence() / 2;
    if (calcValence <= -1.0) {
      calcValence = -0.999;
    }
    if (calcValence >= 1) {
      calcValence = 0.999;
    }
    return calcValence;
  }

  /** Gets the time period of the song */
  public getResolvedTimePeriod() {
    switch (this.getResolvedTheme()) {
      case SongTheme.SciFi:
        return TimePeriod.Future;
      case SongTheme.Fantasy:
        return TimePeriod.Past;
      case SongTheme.Horror:
        return TimePeriod.Present;
    }
    return TimePeriod.Present;
  }

  public getSeed() {
    return this.seed;
  }

  public randomizeSeed() {
    this.seed = new BitString();
    for (let i = 0; i < 8 * 20; i++) {
      this.seed.addBit(Math.random() > 0.5 ? 1 : 0);
    }
  }

  /** Temporary method */
  getInstrument(): string {
    switch (this.getResolvedTheme()) {
      // case SongTheme.SciFi:
      //   switch (this.getType()) {
      //     case SongType.Boss:
      //       return GMInstruments.byCategory.synth_pad.pad_1_new_age.id;
      //     case SongType.Combat:
      //       return GMInstruments.byCategory.synth_effects.fx_7_echoes.id;
      //     case SongType.Exploration:
      //       return GMInstruments.byCategory.synth_effects.fx_2_soundtrack.id;
      //     case SongType.Menu:
      //       return GMInstruments.byCategory.synth_effects.fx_2_soundtrack.id;
      //   }
      // case SongTheme.Fantasy:
      //   switch (this.getType()) {
      //     case SongType.Boss:
      //       return GMInstruments.byCategory.piano.acoustic_grand_piano.id;
      //     case SongType.Combat:
      //       return GMInstruments.byCategory.strings.orchestral_harp.id;
      //     case SongType.Exploration:
      //       return GMInstruments.byCategory.guitar.acoustic_guitar_nylon.id;
      //     case SongType.Menu:
      //       return GMInstruments.byCategory.pipe.flute.id;
      //   }
      // case SongTheme.Horror:
      //   switch (this.getType()) {
      //     case SongType.Boss:
      //       return GMInstruments.byCategory.chromatic_percussion.celesta.id;
      //     case SongType.Combat:
      //       return GMInstruments.byCategory.chromatic_percussion.glockenspiel.id;
      //     case SongType.Exploration:
      //       return GMInstruments.byCategory.chromatic_percussion.music_box.id;
      //     case SongType.Menu:
      //       return GMInstruments.byCategory.organ.drawbar_organ.id;
      //   }
      default:
        return GMInstruments.byCategory.piano.acoustic_grand_piano.id;
    }
  }
}
