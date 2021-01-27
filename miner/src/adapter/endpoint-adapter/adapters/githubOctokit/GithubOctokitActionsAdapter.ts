
import {Observable, throwError} from "rxjs";
import {Action} from "../../outputModels/Action";
import { IConfigGithubOctokit } from "./config/IConfigGithubOctokit";
import { Octokit } from '@octokit/rest';

const {graphql} = require("@octokit/graphql");

export class GithubOctokitActionsAdapter {
  public fetchActions(config: IConfigGithubOctokit): Observable<Action[]>  {
    let pipeline: Observable<Action[]> = new Observable<Action[]>(subscriber => {
      const octokit = new Octokit({
            auth: `token ${config.privateAccessToken}`
      });

      // octokit.actions.listRepoWorkflows({
      //   owner: config.owner,
      //   repo: config.repo,
      // }).then(a => subscriber.next(a as any));
      octokit.repos.listBranches({
        owner: config.owner,
        repo: config.repo,
      }).then(a => subscriber.next(a as any));
    });
    return pipeline;
  }
}
