export abstract class Record {

  id: number;
  created_at: Date;
  updated_at: Date;

  persisted(): boolean {
    return this.id != null;
  }
}
