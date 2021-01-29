import {User} from "./User";

export class Action {
  public user: User;

  constructor(user: User) {
    this.user = user;
  }
}