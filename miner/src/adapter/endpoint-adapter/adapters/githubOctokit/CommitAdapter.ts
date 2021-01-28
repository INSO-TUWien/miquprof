import {IConfigGithubOctokit} from "./config/IConfigGithubOctokit";
import { Observable } from "rxjs";
import { Octokit } from "@octokit/rest";
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
  sha: string | undefined,
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

  constructor(config: IConfigGithubOctokit, octokit:Octokit) {
    this.config = config;
    this.octokit = octokit;
  }

  public fetchCommits (pipeline: Observable<string[]>): Observable<Commit[]> {
    return new Observable<Commit[]>(subscriber => {
      const observer = {
        next: (historyShas: string[]) => {
          this.fetchCommitShas(historyShas)
            .then(commitShas => this.fetchCommitsBySha(commitShas))
            .then(commits => this.fetchCommitFiles(commits))
            .then(shas => subscriber.next(shas));
        },
        error: subscriber.error
      }
      pipeline.subscribe(observer);
    });
  }

  public async fetchCommitShas(historySha: string[]): Promise<string[]> {
    let shas: string[] = [];
    for(const commitSha of historySha) {
      const per_page = 10; 
      let running = true;
      let page = 1;

      while (running) {
        const res = await this.octokit.repos.listCommits({
          owner: this.config.owner,
          repo: this.config.repo,
          sha: commitSha,
          per_page: per_page,
          page: page++
        });
        this.checkOctokitResult(res);
        running = res.data.length === per_page;
        res.data.forEach(commit => shas.push(commit.sha))
        shas =  [...new Set(shas)]; // eliminate duplicates
      }
    }
    shas = shas.filter(sha => !this.fetchedShas.has(sha));
    shas.forEach(sha => this.fetchedShas.add(sha));
    return shas;
  }

  public async fetchCommitsBySha(commitShas: string[]): Promise<Commit[]> {
    return await Promise.all(commitShas.map(async sha => {
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
        tree: { id: commit.tree.sha}
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

// function createCommitObservable (cb: (branches: Branch[], subscriber: Subscriber<Commit[]>) => Promise<Commit[]>, pipeline: Observable<Branch[]>) {
//   return new Observable<Commit[]>(subscriber => {
//       const observer = {
//         next: (data: Branch[]) => {
//             cb(data, subscriber)
//             .then(branch => subscriber.next(branch));
//         },
//         error: subscriber.error,
//       };
//       pipeline.subscribe(observer);
//   });
// }

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
