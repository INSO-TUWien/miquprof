import { IConfigGithubOctokit } from "./config/IConfigGithubOctokit";
import { Observable } from "rxjs";
import { Octokit } from "@octokit/rest";
import { Commit } from "./CommitAdapter";

export interface Branch {
  name:string,
  history: Commit[],
  sha: string,
  protected: boolean
}

export function fetchBranches (config: IConfigGithubOctokit) {
  let result = new Observable<Branch[]>(subscriber => {
    const octokit = new Octokit({
      auth: `token ${config.privateAccessToken}`
    });

    octokit.repos.listBranches({
      owner: config.owner,
      repo: config.repo,
      per_page: 1 // TODO: remove/ replace this line
      // TODO: paging
    }).then(res => {
      if (res.status !== 200) {
        subscriber.error('fetch branches did not return successfully!');
      }
      if (res.data === undefined || !Array.isArray(res.data)) {
        subscriber.error('fetch branches did not return valid data!')
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


