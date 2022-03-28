import { Observable } from "rxjs";
import { clone, listFiles, listBranches, log, checkout, CommitObject, ReadCommitResult } from 'isomorphic-git';
import * as http from 'isomorphic-git/http/node'
import * as fs from 'fs';
import { mkdir } from 'fs/promises'
import { IConfigGithubOctokit } from "../githubOctokit/config/IConfigGithubOctokit";

export interface Branch {
  name:string,
  history: string[], // shas of history (ids)
}

export interface BranchCommitObj {
  branches: Branch[],
  commits: ReadCommitResult[],
}

export class BranchAdapter {
  private config: IConfigGithubOctokit;

  constructor(config: IConfigGithubOctokit) {
      this.config = config;
  }
  
  public async fetchBranches(): Promise<BranchCommitObj> {
    const dir = '../../clone';
    // try {
    //   if (!fs.existsSync(dir)) {
    //     await mkdir(dir);
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
    await clone({
      fs,
      http,
      dir,
      url: `https://github.com/${this.config.owner}/${this.config.repo}`,
      singleBranch: false,
    });
    const isomorphicOptions = {
      fs,
      dir,
    }
    const b = await listBranches({
      ...isomorphicOptions,
      remote: 'origin'
    })
    const commits: Map<string, ReadCommitResult > = new Map();
    const branches = await Promise.all(b.map(async(branch) => {
      await checkout({
        ...isomorphicOptions,
        ref: branch
      });
      
      const history = await log(isomorphicOptions);
      const shas = history.map((x) => x.oid);
      history.forEach(x => {
        if (!commits.has(x.oid)) {
          commits.set(x.oid, x);
        }
      });
      return {
        name: branch,
        history: shas,
      }
    }));

    return {
      branches,
      commits: Array.from(commits.values()),
    };
  }
}
