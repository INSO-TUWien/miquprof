import {IConfigGithubOctokit} from "./config/IConfigGithubOctokit";
import { Observable } from "rxjs";
import { Octokit } from "@octokit/rest";
import { Branch } from "./BranchAdapter";

export interface Commit {
  message: string
}

export function fetchCommits (config: IConfigGithubOctokit, pipeline: Observable<Branch[]>) {
  return new Observable<Branch[]>(subscriber => {
    const observer = {
      next: async (branches: Branch[]) => {
          const octokit = new Octokit({
            auth: `token ${config.privateAccessToken}`
          });
          const result = await Promise.all(branches.map(async branch => {
            const res = await octokit.repos.listCommits({
              owner: config.owner,
              repo: config.repo,
              sha: branch.sha,
              per_page: 5 // TODO: pagination and fetch all
            });
            if (res.status !== 200) {
              subscriber.error('fetch commits did not return successfully!');
            }
            if (res.data === undefined || !Array.isArray(res.data)) {
              subscriber.error('fetch commits did not return valid data!')
            }
            branch.history = res.data.map(data => {
              console.log(data.commit)
              return {
                message: data.commit.message
              }
            });
            return branch;
          }));
          subscriber.next(result);
      },
      error: subscriber.error,
    };
    pipeline.subscribe(observer);
  });
}
  // fetchCommit: async (config: IConfigGithubOctokit) => {
  //   return new Observable<Commit[]>(subscriber => {
  //       const observer = {
  //         next: async (Commit) => {

  //         },
  //       }
  //   });
  // }



