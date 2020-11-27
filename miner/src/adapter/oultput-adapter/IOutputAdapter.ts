import {Issue} from "../../models/Issue";
import {Commit} from "../../models/Commit";
import {User} from "../../models/User";

export interface IOutputAdapter {
    exportIssue(issue: Issue): void;
    exportCommit(commit: Commit): void;
    exportUser(user: User): void;
    close(): void;
}