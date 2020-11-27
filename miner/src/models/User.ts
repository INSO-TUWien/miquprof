export class User {
    public id: string;
    public login: string;
    public email: string;

    constructor(id: string, login: string,  email : string = '') {
        this.id = id;
        this.login = login;
        this.email = email;
    }
}