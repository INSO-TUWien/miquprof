import {IConfigGithubOctokit} from "./config/IConfigGithubOctokit";
import { Observable } from "rxjs";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { Branch } from "./BranchAdapter";
import { checkOctokitResult } from "../../helpers/checkOctokitResult";
import { createBranchObservable } from "./createBranchObservable";
export interface Commit {
  message: string | undefined,
  sha: string,
  tree: CommitTree | undefined
}

export interface CommitTree {
  sha: string
}

export function fetchCommits (config: IConfigGithubOctokit, octokit:Octokit,  pipeline: Observable<Branch[]>) {
  return createBranchObservable(async (branches: Branch[], subscriber) => {
      return await Promise.all(
        branches.map(async branch => {
          const res = await octokit.repos.listCommits({
            owner: config.owner,
            repo: config.repo,
            sha: branch.sha,
            per_page: 5 // TODO: pagination and fetch all
          });
          if (checkOctokitResult(res, subscriber)) {
            return branch;
          }
          // branch.history = await Promise.all(
          //   res.data.map(async data => {
          //     console.log(data.files)
          //     return {
          //         message: '',
          //         sha: '',
          //         tree: []
          //     };
          //   }));
          branch.history = res.data.map(value => {
            return {
              sha: value.sha
            } as Commit;
          })
        return branch;
      }));
  }, pipeline);
}

export function fetchCommitData(config: IConfigGithubOctokit, octokit:Octokit, pipeline: Observable<Branch[]>) {
  return createBranchObservable(async (branches: Branch[], subscriber) => {
    return await Promise.all(branches.map(async branch => {
        const history = await Promise.all(branch.history.map(async (commit: Commit) => {
          const res = await octokit.git.getCommit({
            repo: config.repo,
            owner: config.owner,
            commit_sha: commit.sha
          });
          if (checkOctokitResult(res, subscriber)) {
            return commit;
          }
          return {
            sha: commit.sha,
            message: res.data.message,
            tree: {
              sha: res.data.tree.sha
            }
          };
        }));
        branch.history = history;
        return branch;
    }));
}, pipeline);
}

// export function fetchTrees(config: IConfigGithubOctokit, octokit:Octokit, pipeline: Observable<Branch[]>) {
//   // return new Observa
// }
