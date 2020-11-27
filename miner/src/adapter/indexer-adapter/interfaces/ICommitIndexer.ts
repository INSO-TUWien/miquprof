import {Observable} from "rxjs";
import {Commit} from "../../../models/Commit";

export interface ICommitIndexer {
    indexCommits(commitObservable: Observable<Commit[]>): void;
}