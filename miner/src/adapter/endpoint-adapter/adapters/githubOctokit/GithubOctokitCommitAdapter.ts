import {IConfigGithubOctokit} from "./config/IConfigGithubOctokit";
import {Observable, throwError} from "rxjs";
import {Cursor} from "../../outputModels/Cursor";
import {Commit} from "../../outputModels/Commit";
import {combineFetch} from "../../helperFunctions/combineFetch";

const {graphql} = require("@octokit/graphql");

export class GithubOctokitCommitAdapter {
  public fetchCommits(config: IConfigGithubOctokit): Observable<Commit[]>  {
    let pipeline: Observable<Commit[]> = new Observable<Commit[]>(subscriber => {
      combineFetch(config, subscriber, this.executeFetchCommitsFromGithub).then(() => subscriber.complete());
    });
    return pipeline;
  }
  private async executeFetchCommitsFromGithub(config: IConfigGithubOctokit, cursor: Cursor): Promise<[Commit[], Cursor]> {
    const query = `
      query fetchIssues($owner: String!, $repo: String!, $num: Int = 10) {
        repository(name: $repo, owner: $owner) {
          defaultBranchRef {
            name
            target {
              ... on Commit {
                history(first: $num${cursor.endCursor === '' ? '' : `, after: "${cursor.endCursor}"`}) {
                  nodes {
                    id
                    pushedDate
                    message
                    changedFiles
                    additions
                    deletions
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
            }
          }
        }
      }
    `;
    let {repository} = await graphql(query,
      {
        owner: config.owner,
        repo: config.repo,
        headers: {
          authorization: `token ${config.privateAccessToken}`,
        },
      }
    );
    let commits = [];
    for (let node of repository.defaultBranchRef.target.history.nodes) {
      commits.push(new Commit(node.id, new Date(node.pushedDate), node.message, node.changedFiles, node.additions, node.deletions));
    }
    return [
      commits,
      repository.defaultBranchRef.target.history.pageInfo
    ];
  }
}
