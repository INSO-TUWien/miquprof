import {User} from "./User";

export class Issue {
    public id: string;
    public author: User;
    public createdAt: Date;
    public closed: Boolean;
    public title: String;
    public number: Number;
    public textBody: String;

    constructor(id: string, author: User, createdAt: Date, closed: Boolean, title: String, number: Number, textBody: String) {
        this.id = id;
        this.author = author;
        this.createdAt = createdAt;
        this.closed = closed;
        this.title = title;
        this.number = number;
        this.textBody = textBody;
    }
}