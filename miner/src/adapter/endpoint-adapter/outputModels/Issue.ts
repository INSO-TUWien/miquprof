import {User} from "./User";

export class Issue {
    public id: string;
    public author: User;
    public createdAt: Date;
    public closed: Boolean;
    public title: string;
    public number: Number;
    public textBody: string;

    constructor(id: string, author: User, createdAt: Date, closed: Boolean, title: string, number: Number, textBody: string) {
        this.id = id;
        this.author = author;
        this.createdAt = createdAt;
        this.closed = closed;
        this.title = title;
        this.number = number;
        this.textBody = textBody;
    }
}