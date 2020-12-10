import {Observable} from "rxjs";
import {Commit} from "../../endpoint-adapter/outputModels/Commit";

export interface ICommitIndexer {
    indexCommits(commitObservable: Observable<Commit[]>): void;
}