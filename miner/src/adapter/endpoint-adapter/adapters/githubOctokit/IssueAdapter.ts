import { IConfigGithubOctokit } from "./config/IConfigGithubOctokit";
import { Observable } from "rxjs";
import { Octokit } from "@octokit/rest";
import { checkOctokitResult } from "../../helpers/checkOctokitResult";

export interface Issue {
    id: number,
    number: number,
    title: string,
    comments: number,
    updated_at: string,
    labels: string[]
}

export class IssueAdapter {
  private config: IConfigGithubOctokit;
  private octokit: Octokit;

  constructor(config: IConfigGithubOctokit, octokit: Octokit) {
    this.config = config;
    this.octokit = octokit;
  }

  public async fetchIssues () {
      let issues: Issue[] = [];
      let page = 1;
      let running = true; 
      const fetchPerPage = 10;
      do {
        const res = await this.octokit.issues.listForRepo({
          owner: this.config.owner,
          repo: this.config.repo,
          per_page: fetchPerPage,
          page: page++
        });
        if (checkOctokitResult(res)) {
          running = false;
        } else {
          running = res.data.length === fetchPerPage;
          issues = issues.concat(res.data.map(issue => {
            return {
              id: issue.id,
              number: issue.number,
              title: issue.title,
              comments: issue.comments,
              updated_at: issue.updated_at,
              labels: issue.labels.map(label => (typeof label === 'string' ? label:  label.name))
              // todo: maybe add PR or other data like user
            } as Issue
          }))
        }
      } while(running);
      return issues;
  }

}


