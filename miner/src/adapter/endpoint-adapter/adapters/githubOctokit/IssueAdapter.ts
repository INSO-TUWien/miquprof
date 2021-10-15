import { IConfigGithubOctokit } from "./config/IConfigGithubOctokit";
import { Observable } from "rxjs";
import { Octokit } from "@octokit/rest";
import { checkOctokitResult } from "../../helpers/checkOctokitResult";

export interface Issue {
    id: number,
    number: number,
    title: string,
    comments: number,
    updated_at: string,
    labels: string[]
}

export function fetchIssues (config: IConfigGithubOctokit, octokit: Octokit) {
  let result = new Observable<Issue[]>(subscriber => {
    const fetch = async() => {
      let page = 1;
      let running = true;
      const fetchPerPage = 10;
      do {
        const res = await octokit.issues.listForRepo({
          owner: config.owner,
          repo: config.repo,
          per_page: fetchPerPage,
          page: page++
        });
        if (checkOctokitResult(res, subscriber)) {
          running = false;
        } else {
          running = res.data.length === fetchPerPage;
          subscriber.next(res.data.map(issue => {
            return {
              id: issue.id,
              number: issue.number,
              title: issue.title,
              comments: issue.comments,
              updated_at: issue.updated_at,
              labels: issue.labels.map(label => label.name)
              // todo: maybe add PR or other data like user
            }
          }));
        }
      } while(running);
    }
    fetch().catch(subscriber.error);
  });
  return result;
}


