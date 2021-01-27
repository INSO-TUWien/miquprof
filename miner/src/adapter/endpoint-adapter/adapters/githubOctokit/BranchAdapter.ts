import { IConfigGithubOctokit } from "./config/IConfigGithubOctokit";
import { Observable, Subscriber } from "rxjs";
import { Octokit } from "@octokit/rest";
import { Commit } from "./CommitAdapter";
import { checkOctokitResult } from "../../helpers/checkOctokitResult";

export interface Branch {
  name:string,
  history: Commit[],
  sha: string,
  protected: boolean
}

export function fetchBranches (config: IConfigGithubOctokit, octokit: Octokit) {
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
          subscriber.next(res.data.map(branch => {
            return {
              name: branch.name,
              sha: branch.commit.sha,
              history: [],
              protected: branch.protected
            }
          }));
        }
      } while(running);
    }
    fetch().catch(subscriber.error);
  });
  return result;
}


