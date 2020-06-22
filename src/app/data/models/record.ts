export abstract class Record {

  id: number;

  persisted(): boolean {
    return this.id != null;
  }
}
