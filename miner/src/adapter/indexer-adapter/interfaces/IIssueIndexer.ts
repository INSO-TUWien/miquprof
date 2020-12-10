import {Observable} from "rxjs";
import {Issue} from "../../endpoint-adapter/outputModels/Issue";

export interface IIssueIndexer {
    indexIssues(issueObservable: Observable<Issue[]>): void;
}