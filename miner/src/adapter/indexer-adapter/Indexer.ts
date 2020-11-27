import {IOutputAdapter} from "../oultput-adapter/IOutputAdapter";
import {IIssueIndexer} from "./interfaces/IIssueIndexer";
import {Issue} from "../../models/Issue";
import {Commit} from "../../models/Commit";
import {ICommitIndexer} from "./interfaces/ICommitIndexer";
import {Observable} from "rxjs";

export class Indexer implements IIssueIndexer, ICommitIndexer{
    private outputAdapter: IOutputAdapter;
    private usersEmails: string[] = [];
    private issuesFinished = false;
    private commitsFinished = false;

    constructor(outputAdapter: IOutputAdapter) {
        this.outputAdapter = outputAdapter;
    }

    public indexIssues(issueObservable: Observable<Issue[]>): void {
        issueObservable.subscribe(issues => {
            issues
                .forEach((issue) => {
                    if (this.usersEmails.filter((email) => issue.author.email === email).length <= 0) {
                        this.usersEmails.push(issue.author.email);
                        this.outputAdapter.exportUser(issue.author);
                    }
                    this.outputAdapter.exportIssue(issue);
                });
        }, e => console.log(e), () => {
            this.issuesFinished = true;
            this.checkFinished();
        });
    }

    public indexCommits(commitObservable:Observable<Commit[]>): void {
        commitObservable.subscribe(commits => commits.forEach(commit => this.outputAdapter.exportCommit(commit)), (e) => console.log(e), () => {
            this.commitsFinished = true;
            this.checkFinished();
        })
    }

    private checkFinished() {
        if (this.issuesFinished && this.commitsFinished) {
            this.outputAdapter.close();
        }
    }
}