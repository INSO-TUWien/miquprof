import {IEndpointAdapter} from "../../IEnpointAdapter";
import {IConfigGithubOctokit} from "./IConfigGithubOctokit";
import {Observable, throwError} from "rxjs";
import {Issue} from "../../../models/IModels/Issue";
import {User} from "../../../models/IModels/User";
import {Cursor} from "../../../models/Cursor";
import {Commit} from "../../../models/IModels/Commit";
import {Action} from "../../../models/IModels/Action";

const {graphql} = require("@octokit/graphql");

export class GithubOctokit implements IEndpointAdapter {
  // public fetchUsers(config: IConfigGithubOctokit): Observable<[User]>  {
  //   let pipeline: Observable<[User]> = new Observable<[User]>(subscriber => {
  //     this.combineFetch(config, subscriber, this.executeFetchUsersFromGithub).then(() => subscriber.complete());
  //   });
  //   return pipeline;
  // }
  public fetchIssues(config: IConfigGithubOctokit): Observable<Issue[]> {
    let pipeline: Observable<Issue[]> = new Observable<Issue[]>(subscriber => {
      this.combineFetch(config, subscriber, this.executeFetchIssuesFromGithub).then(() => subscriber.complete());
    });
    return pipeline;
  }
  public fetchCommits(config: IConfigGithubOctokit): Observable<Commit[]>  {
    let pipeline: Observable<Commit[]> = new Observable<Commit[]>(subscriber => {
      this.combineFetch(config, subscriber, this.executeFetchCommitsFromGithub).then(() => subscriber.complete());
    });
    return pipeline;
  }
  // public fetchActions(config: IConfigGithubOctokit): Observable<[Action]>  {
  //   let pipeline: Observable<[Action]> = new Observable<[Action]>(subscriber => {
  //     this.combineFetch(config, subscriber, this.executeFetchActionsFromGithub).then(() => subscriber.complete());
  //   });
  //   return pipeline;
  // }

  private async combineFetch(config: IConfigGithubOctokit,subscriber: any, functionToCall: (config: IConfigGithubOctokit, cursor: Cursor) => Promise<[any[], Cursor]>): Promise<void> {
    let [data, cursor] = await functionToCall(config, new Cursor('', true));
    subscriber.next(data);
    while (cursor.hasNextPage) {
      const result = await functionToCall(config, cursor);
      data = result[0];
      cursor = result[1];
      subscriber.next(data);
    }
  }

  // private async executeFetchUsersFromGithub(config: IConfigGithubOctokit, cursor: Cursor): Promise<[User[], Cursor]> {
  //   const query = `
  //     query fetchIssues($owner: String!, $repo: String!, $num: Int = 10) {
  //       repository(owner: $owner, name: $repo) {
  //         issues(first: $num${cursor.endCursor === '' ? '' : `, after: "${cursor.endCursor}"`}) {
  //           pageInfo {
  //             hasNextPage
  //             endCursor
  //           }
  //           nodes {
  //             author {
  //         ... on Bot {
  //           id
  //           login
  //         }
  //         ... on User {
  //           id
  //           email
  //           login
  //           }
  //         }
  //         number
  //         bodyText
  //         closed
  //         createdAt
  //         id
  //         title
  //           }
  //         }
  //       }
  //     }
  //   `;
  //   let {repository} = await graphql(query,
  //     {
  //       owner: config.owner,
  //       repo: config.repo,
  //       headers: {
  //         authorization: `token ${config.privateAccessToken}`,
  //       },
  //     }
  //   );
  //   let issues = [];
  //
  //   for (let node of repository.issues.nodes) {
  //     issues.push(new Issue(node.id, new User(node.author.id, node.author.login, node.author.email), new Date(node.createdAt), node.closed, node.title, node.number, node.textBody));
  //   }
  //   return [
  //     repository.issues.nodes,
  //     repository.issues.pageInfo
  //   ];
  // }
  private async executeFetchIssuesFromGithub(config: IConfigGithubOctokit, cursor: Cursor): Promise<[Issue[], Cursor]> {
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
      issues.push(new Issue(node.id, new User(node.author.id, node.author.login, node.author.email), new Date(node.createdAt), node.closed, node.title, node.number, node.bodyText));
    }
    return [
      issues,
      repository.issues.pageInfo
    ];
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
    console.log(repository.defaultBranchRef.target.history.nodes)
    for (let node of repository.defaultBranchRef.target.history.nodes) {
      commits.push(new Commit(node.id, new Date(node.pushedDate), node.message, node.changedFiles, node.additions, node.deletions));
    }
    return [
      commits,
      repository.defaultBranchRef.target.history.pageInfo
    ];
  }
  // private async executeFetchActionsFromGithub(config: IConfigGithubOctokit, cursor: Cursor): Promise<[[Action], Cursor]> {
  //   const query = `
  //     query fetchIssues($owner: String!, $repo: String!, $num: Int = 10) {
  //       repository(name: $repo, owner: $owner) {
  //         defaultBranchRef {
  //           name
  //           target {
  //             ... on Commit {
  //               id
  //               changedFiles
  //               history(first: $num${cursor.endCursor === '' ? '' : `, after: "${cursor.endCursor}"`}) {
  //                 pageInfo {
  //                   endCursor
  //                   startCursor
  //                 }
  //                 nodes {
  //                   id
  //                   checkSuites(last: 10) {
  //                     nodes {
  //                       checkRuns(last: 10) {
  //                         nodes {
  //                           conclusion
  //                           completedAt
  //                           name
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `;
  //   let {repository} = await graphql(query,
  //     {
  //       owner: config.owner,
  //       repo: config.repo,
  //       headers: {
  //         authorization: `token ${config.privateAccessToken}`,
  //       },
  //     }
  //   );
  //   let issues = [];
  //   console.log(repository)
  //
  //   for (let node of repository.issues.nodes) {
  //     issues.push(new Issue(node.id, new User(node.author.id, node.author.login, node.author.email), new Date(node.createdAt), node.closed, node.title, node.number, node.textBody));
  //   }
  //   return [
  //     repository.issues.nodes,
  //     repository.issues.pageInfo
  //   ];
  // }
}
