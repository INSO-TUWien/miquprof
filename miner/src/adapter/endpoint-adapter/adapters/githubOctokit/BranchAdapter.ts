import { IConfigGithubOctokit } from "./config/IConfigGithubOctokit";
import { Observable } from "rxjs";
import { Octokit } from "@octokit/rest";
import { Commit } from "./CommitAdapter";
import { checkOctokitResult } from "../../helpers/checkOctokitResult";
import { sub } from "args";

export interface Branch {
  name:string,
  history: Commit[],
  sha: string,
  protected: boolean
}

export function fetchBranches (config: IConfigGithubOctokit, octokit: Octokit) {
  let result = new Observable<Branch[]>(subscriber => {
    octokit.repos.listBranches({
      owner: config.owner,
      repo: config.repo,
      per_page: 1 // TODO: remove/ replace this line
      // TODO: paging
    }).then(res => {
      if (checkOctokitResult(res, subscriber)) {
        return {};
      }
      subscriber.next(res.data.map(branch => {
        return {
          name: branch.name,
          sha: branch.commit.sha,
          history: [],
          protected: branch.protected
        }
      }))
    }).catch(subscriber.error);
  });
  return result;
}


