import {Observable} from "rxjs";
import {Issue} from "../../../models/Issue";

export interface IIssueIndexer {
    indexIssues(issueObservable: Observable<Issue[]>): void;
}