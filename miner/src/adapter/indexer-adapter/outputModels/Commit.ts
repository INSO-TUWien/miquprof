export class Commit {
  public _id: string;
  public pushedDate: Date;
  public message: string;
  public changedFiles: number;
  public additions: number;
  public deletions: number;

  constructor(id: string, pushedDate: Date, message: string, changedFiles: number, additions: number, deletions: number) {
    this._id = id;
    this.pushedDate = pushedDate;
    this.message = message;
    this.changedFiles = changedFiles;
    this.additions = additions;
    this.deletions = deletions;
  }
}