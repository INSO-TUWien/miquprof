import {IConfigGithubOctokit} from "./config/IConfigGithubOctokit";
import { Observable } from "rxjs";
import { Octokit } from "@octokit/rest";
import { Branch } from "./BranchAdapter";
export interface Commit {
  message: string | undefined,
  id: string,
  tree: CommitTree | undefined,
  files: any | undefined
}

export interface CommitTree {
  id: string,
  files: TreeFile[] | undefined // todo: change typing
}

export interface TreeFile {
  id: string | undefined,
  filename: string | undefined,
  additions: number | undefined,
  deletions: number | undefined,
  changes: number | undefined,
  status: string | undefined
}

export class CommitAdapter {
  private config: IConfigGithubOctokit;
  private octokit: Octokit;
  private fetchedShas: Set<string> = new Set();

  constructor(config: IConfigGithubOctokit, octokit: Octokit) {
    this.config = config;
    this.octokit = octokit;
  }

  public fetchCommits (pipeline: Observable<Branch[]>): Observable<Commit[]> {
    return new Observable<Commit[]>(subscriber => {
      const observer = {
        next: (branches: Branch[]) => {
          this.fetchCommitsBySha(this.branchesToShas(branches))
            .then(res => this.fetchCommitFiles(res))
            .then(res => subscriber.next(res)); // do not use then(subscriber.next), it can cause errors
        },
        error: subscriber.error
      }
      pipeline.subscribe(observer);
    });
  }

  public branchesToShas(branches: Branch[]) {
    const shas = [];
    for(let branch of branches) {
      for (let sha of branch.history) {
        shas.push(sha);
      }
    }
    const res = [];
    for(let sha of shas) {
      if (!this.fetchedShas.has(sha)) {
        this.fetchedShas.add(sha);
        res.push(sha);
      }
    }
    return res;
  }

  public async fetchCommitsBySha(commitShas: string[]): Promise<Commit[]> {
    return await Promise.all(commitShas.map(async (sha) => {
      const res = await this.octokit.git.getCommit({
        repo: this.config.repo,
        owner: this.config.owner,
        commit_sha: sha
      });
      this.checkOctokitResult(res);
      const commit = res.data;
      return {
        id: sha,
        message: commit.message,
        tree: { id: commit.tree.sha},
      } as Commit;
    }));
  }

  public async fetchCommitFiles (commits: Commit[]): Promise<Commit[]> {
    return await Promise.all(commits.map(async (commit: Commit) => {
      const res = await this.octokit.repos.getCommit({
        repo: this.config.repo,
        owner: this.config.owner,
        ref: commit.id
      });
      this.checkOctokitResult(res);

      commit.files = res.data.files?.map((file: any) => {
        return {
          id: file.sha,
          filename: file.filename,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
          status: file.status
        } as TreeFile;
      });
      return commit;
    }));
  }

  private checkOctokitResult(res: any) {
    if (res.status !== 200) {
        throw new Error('fetch commits did not return successfully!');
    }
    if (res.data === undefined) {
      throw new Error('data is undefined!');
    }
  }
}
