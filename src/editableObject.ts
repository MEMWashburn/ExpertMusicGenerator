import * as uuid from 'uuid';

export abstract class EditableObject {
  /** A globally unique ID for this object */
  protected id: string;
  /** A user defined name for this object (not necessarily unique) */
  protected name: string;
  /** The date the user first created this object */
  protected created: Date;
  /** The date the user last edited this object */
  protected lastEdited: Date;
  /** A flag to indicate if the object has been edited since it was last saved */
  protected modified = false;

  constructor() {
    this.id = uuid();
    this.name = 'New Object';
    this.created = new Date();
    this.lastEdited = new Date();
  }

  /** Returns true if the object has been edited since it was last saved */
  public isModified() {
    return this.modified;
  }

  /** Returns the date that this object was lated edited */
  public getLastEdited() {
    return this.lastEdited;
  }

  /** Gets the date this object was originally created */
  public getCreated() {
    return this.created;
  }

  /** Returns the unique ID associated with this object */
  public getId() {
    return this.id;
  }

  /** Returns the user set name for this object (may not be unique) */
  public getName() {
    return this.name;
  }

  /** Sets the name of this object */
  public setName(newName: string) {
    if (newName !== this.name) {
      this.markChange();
      this.name = newName;
    }
  }

  /** Marks the object as having been changes since it was last saved. */
  public markChange() {
    this.modified = true;
    this.lastEdited = new Date();
  }
}
