import {Issue} from "../indexer-adapter/outputModels/Issue";
import {Commit} from "../indexer-adapter/outputModels/Commit";
import {User} from "../indexer-adapter/outputModels/User";


export interface IOutputAdapter {
    exportIssue(issue: Issue): void;
    exportCommit(commit: Commit): void;
    exportUser(user: User): void;
    close(): void;
}