import { IConfigGithubOctokit } from "./config/IConfigGithubOctokit";
import { Observable, Subscriber } from "rxjs";
import { Octokit } from "@octokit/rest";
import { Commit } from "./CommitAdapter";
import { checkOctokitResult } from "../../helpers/checkOctokitResult";

export interface Branch {
  name:string,
  history: string[], // shas of history (ids)
  id: string,
  protected: boolean
}

export class BranchAdapter {
  private config: IConfigGithubOctokit;
  private octokit: Octokit;
  private fetchedShas: Set<string> = new Set();

  constructor(config: IConfigGithubOctokit, octokit:Octokit) {
    this.config = config;
    this.octokit = octokit;
  }

  public fetchBranches(config: IConfigGithubOctokit, octokit: Octokit): Observable<Branch[]> {
    let result = new Observable<Branch[]>(subscriber => {
      const fetch = async() => {
        let page = 1;
        let running = true;
        const fetchPerPage = 10;
        do {
          const res = await octokit.repos.listBranches({
            owner: config.owner,
            repo: config.repo,
            per_page: fetchPerPage,
            page: page++
          });
          if (checkOctokitResult(res, subscriber)) {
            running = false;
          } else {
            running = res.data.length === fetchPerPage;
            subscriber.next(await Promise.all(res.data.map(async branch => {
              return {
                name: branch.name,
                id: branch.commit.sha,
                history: await this.fetchBranchHistory(branch.commit.sha, subscriber),
                protected: branch.protected
              }
            })));
          }
        } while(running);
      }
      fetch().catch(subscriber.error);
    });
    return result;
  }

  private async fetchBranchHistory(branchSha: string, subscriber: Subscriber<Branch[]>): Promise<string[]> {
    let shas: string[] = [];
    const per_page = 10; 
    let running = true;
    let page = 1;

    while (running) {
      const res = await this.octokit.repos.listCommits({
        owner: this.config.owner,
        repo: this.config.repo,
        sha: branchSha,
        per_page: per_page,
        page: page++
      });
      checkOctokitResult(res, Subscriber);
      running = res.data.length === per_page;
      res.data.forEach(commit => shas.push(commit.sha))
    }
    return shas;
  }
}
