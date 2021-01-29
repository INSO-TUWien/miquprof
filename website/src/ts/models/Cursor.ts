export class Cursor {
  public endCursor: string;
  public hasNextPage: boolean ;

  constructor(endCursor: string, hasNextPage: boolean) {
    this.endCursor = endCursor;
    this.hasNextPage = hasNextPage;
  }
}