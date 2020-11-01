import {Author} from "./Author";

export class Issue {
    public id: string;
    public author: Author;
    public createdAt: Date;
    public closed: Boolean;
    public title: String;
    public number: Number;
    public textBody: String;

    constructor(id: string, author: Author, createdAt: Date, closed: Boolean, title: String, number: Number, textBody: String) {
        this.id = id;
        this.author = author;
        this.createdAt = createdAt;
        this.closed = closed;
        this.title = title;
        this.number = number;
        this.textBody = textBody;
    }
}