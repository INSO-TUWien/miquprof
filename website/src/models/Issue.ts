export class Issue {
    public id: string;
    public authorId: string;
    public createdAt: Date;
    public closed: Boolean;
    public title: String;
    public number: Number;
    public textBody: String;

    constructor(id: string, authorId: string, createdAt: Date, closed: Boolean, title: String, number: Number, textBody: String) {
        this.id = id;
        this.authorId = authorId;
        this.createdAt = createdAt;
        this.closed = closed;
        this.title = title;
        this.number = number;
        this.textBody = textBody;
    }
}