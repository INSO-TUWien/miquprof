import {Observable} from "rxjs";
import {Issue} from "../models/IModels/Issue";
import {IConfigGithubOctokit} from "./Adapters/GithubOctokit/IConfigGithubOctokit";
import {Commit} from "../models/IModels/Commit";

export interface IEndpointAdapter {
    fetchIssues:(config:any)=>Observable<Issue[]>;
    fetchCommits(config: IConfigGithubOctokit): Observable<Commit[]>;
}