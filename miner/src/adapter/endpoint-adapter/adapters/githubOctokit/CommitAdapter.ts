import {IConfigGithubOctokit} from "./config/IConfigGithubOctokit";
import { Observable, Subscriber } from "rxjs";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { Branch } from "./BranchAdapter";
import { checkOctokitResult } from "../../helpers/checkOctokitResult";
import { createBranchObservable } from "./createBranchObservable";
export interface Commit {
  message: string | undefined,
  sha: string,
  tree: CommitTree | undefined,
  files: any | undefined
}

export interface CommitTree {
  sha: string,
  files: TreeFile[] | undefined // todo: change typing
}

export interface TreeFile {
  sha: string | undefined,
  filename: string | undefined,
  additions: number | undefined,
  deletions: number | undefined,
  changes: number | undefined,
  status: string | undefined
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
        branch.history = await Promise.all(branch.history.map(async (commit: Commit) => {
          const res = await octokit.git.getCommit({
            repo: config.repo,
            owner: config.owner,
            commit_sha: commit.sha
          });
          if (checkOctokitResult(res, subscriber)) {
            return commit;
          }
          commit.message = res.data.message;
          return commit;
        }));
        return branch;
    }));
  }, pipeline);
}

export function fetchCommitFiles (config: IConfigGithubOctokit, octokit:Octokit, pipeline: Observable<Branch[]>) {
  return createBranchObservable(async (branches: Branch[], subscriber) => {
    return await Promise.all(branches.map(async branch => {
        branch.history = await Promise.all(branch.history.map(async (commit: Commit) => {
          const res = await octokit.repos.getCommit({
            repo: config.repo,
            owner: config.owner,
            ref: commit.sha
          });
          if (checkOctokitResult(res, subscriber)) {
            return commit;
          }
          commit.files = res.data.files?.map(file => {
            return {
              sha: file.sha,
              filename: file.filename,
              additions: file.additions,
              deletions: file.deletions,
              changes: file.changes,
              status: file.status
            } as TreeFile;
          });
          return commit;
        }));
      return branch;
    }));
  }, pipeline);
}

// export function fetchCommitTrees(config: IConfigGithubOctokit, octokit:Octokit, pipeline: Observable<Branch[]>) {
//   return createBranchObservable(async (branches: Branch[], subscriber) => {
//     return await Promise.all(branches.map(async branch => {
//         branch.history = await Promise.all(branch.history.map(async (commit: Commit) => {
//           if (commit.tree?.sha === undefined) {
//             return commit;
//           }
//           commit.tree = await fillTree(octokit, config, commit.tree, subscriber);
//           return commit;
//         }));
//       return branch;
//     }));
//   }, pipeline);
// }

// const fillTree = async function(octokit: Octokit, config: IConfigGithubOctokit, tree: CommitTree, subscriber: Subscriber<Branch[]>) {
//   const res = await octokit.git.getTree({
//     repo: config.repo,
//     owner: config.owner,
//     tree_sha: tree.sha
//   });
//   if (checkOctokitResult(res, subscriber)) {
//     return tree;
//   }
//   tree.files = res.data.tree.map(file => {
//     let result: TreeFile = {
//       sha: file.sha
//     };
//     switch (file.type) {
//       case 'tree':
//         break;
//       case 'blob':
//         break;
//     }
//     return result;
//   });
//   return tree;
// }
