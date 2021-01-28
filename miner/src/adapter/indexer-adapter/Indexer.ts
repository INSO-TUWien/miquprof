import {IIssueIndexer} from "./interfaces/IIssueIndexer";
import {Issue} from "../endpoint-adapter/outputModels/Issue";
import {Issue as OutputIssue} from "../indexer-adapter/outputModels/Issue";
import {Commit} from "../endpoint-adapter/outputModels/Commit";
import {Commit as OutputCommit} from "../indexer-adapter/outputModels/Commit";
import {User as OutputUser} from "../indexer-adapter/outputModels/User";
import {ICommitIndexer} from "./interfaces/ICommitIndexer";
import {Observable} from "rxjs";

export class Indexer implements IIssueIndexer, ICommitIndexer{
    private outputAdapter: any;
    private usersEmails: string[] = [];
    private issuesFinished = false;
    private commitsFinished = false;

    constructor(outputAdapter: any) {
        this.outputAdapter = outputAdapter;
    }

    public indexIssues(issueObservable: Observable<Issue[]>): void {
        issueObservable.subscribe(issues => {
            issues
                .forEach((issue) => {
                    if (this.usersEmails.filter((email) => issue.author.email === email).length <= 0) {
                        this.usersEmails.push(issue.author.email);
                        this.outputAdapter.exportUser(new OutputUser(issue.author.id, issue.author.login, issue.author.email));
                    }
                    this.outputAdapter.exportIssue(new OutputIssue(issue.id, issue.author.id, issue.createdAt, issue.closed, issue.title, issue.number, issue.textBody));
                });
        }, e => console.log(e), () => {
            this.issuesFinished = true;
            this.checkFinished();
        });
    }

    public indexCommits(commitObservable:Observable<Commit[]>): void {
        commitObservable.subscribe(commits => commits.forEach(commit => this.outputAdapter.exportCommit(new OutputCommit(commit.id, commit.pushedDate, commit.message, commit.changedFiles, commit.additions, commit.deletions))), (e) => console.log(e), () => {
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