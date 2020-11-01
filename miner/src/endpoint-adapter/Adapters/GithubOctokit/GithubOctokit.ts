import {IEndpointAdapter} from "../../IEnpointAdapter";
import {IConfigGithubOctokit} from "./IConfigGithubOctokit";
import {Observable, throwError} from "rxjs";
import {Issue} from "../../../models/Issue";
import {Author} from "../../../models/Author";
import {Cursor} from "../../../models/Cursor";

const {graphql} = require("@octokit/graphql");

export class GithubOctokit implements IEndpointAdapter {
  public fetchIssues(config: IConfigGithubOctokit): Observable<[Issue]> {
    let pipeline: Observable<[Issue]> = new Observable<[Issue]>(subscriber => {
      this.combineFetchIssues(config, subscriber).then(() => subscriber.complete());
    });
    return pipeline;
  }

  private async combineFetchIssues(config: IConfigGithubOctokit,subscriber: any): Promise<void> {
    let [issues, cursor] = await this.executeFetchFromGithub(config, new Cursor('', true));
    subscriber.next(issues);
    while (cursor.hasNextPage) {
      const result = await this.executeFetchFromGithub(config, cursor);
      issues = result[0];
      cursor = result[1];
      subscriber.next(issues);
    }
  }

  private async executeFetchFromGithub(config: IConfigGithubOctokit, cursor: Cursor): Promise<[[Issue], Cursor]> {
    const query = `
      query fetchIssues($owner: String!, $repo: String!, $num: Int = 10) {
        repository(owner: $owner, name: $repo) {
          issues(first: $num${cursor.endCursor === '' ? '' : `, after: "${cursor.endCursor}"`}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              author {
          ... on Bot {
            id
            login
          }
          ... on User {
            id
            email
            login
            }
          }
          number
          bodyText
          closed
          createdAt
          id
          title
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
    let issues = [];

    for (let node of repository.issues.nodes) {
      issues.push(new Issue(node.id, new Author(node.author.id, node.author.login, node.author.email), new Date(node.createdAt), node.closed, node.title, node.number, node.textBody));
    }
    return [
      repository.issues.nodes,
      repository.issues.pageInfo
    ];
  }
}
