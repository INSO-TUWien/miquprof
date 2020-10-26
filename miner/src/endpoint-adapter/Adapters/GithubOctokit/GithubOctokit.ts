import {IEndpointAdapter} from "../../IEnpointAdapter";
import {IConfigGithubOctokit} from "./IConfigGithubOctokit";

const {graphql} = require("@octokit/graphql");

export class GithubOctokit implements IEndpointAdapter{
    public async fetch(config: IConfigGithubOctokit) {
        const {repository} = await graphql(
            `
    query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner: $owner, name: $repo) {
        issues(last: $num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  `,
            {
                owner: config.owner,
                repo: config.repo,
                headers: {
                    authorization: `token ${config.privateAccessToken}`,
                },
            }
        );
        console.log(repository.issues.edges);
        return 1;
    }

}
