import {IConfigGithubOctokit} from "./config/IConfigGithubOctokit";
import {Observable, Subscriber, throwError} from "rxjs";
import {Commit} from "../../outputModels/Commit";
import { Octokit } from "@octokit/rest";

export class GithubOctokitCommitAdapter {
  public fetchCommits(config: IConfigGithubOctokit): Observable<Commit[]>  {
    let pipeline: Observable<Commit[]> = new Observable<Commit[]>(subscriber => {
      const octokit = new Octokit({
        auth: `token ${config.privateAccessToken}`
      });

      octokit.repos.listBranches({
        owner: config.owner,
        repo: config.repo,
      }).then(a => subscriber.next(a as any))
        .catch(subscriber.error);
    });
    return pipeline;
  }
}
