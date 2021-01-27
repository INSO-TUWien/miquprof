import args from 'args';
import dotenv from 'dotenv';
import { GithubOctokitIssueAdapter } from "./adapter/endpoint-adapter/adapters/githubOctokit/GithubOctokitIssueAdapter";
import {GithubOctokitCommitAdapter} from "./adapter/endpoint-adapter/adapters/githubOctokit/GithubOctokitCommitAdapter";
import {Indexer} from "./adapter/indexer-adapter/Indexer";
import {OutputJSON} from "./adapter/oultput-adapter/Output";
import { GithubOctokitActionsAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/GithubOctokitActionsAdapter';
import {Branch, fetchBranches } from './adapter/endpoint-adapter/adapters/githubOctokit/BranchAdapter';
import { Commit } from './adapter/indexer-adapter/outputModels/Commit';
import { fetchCommits } from './adapter/endpoint-adapter/adapters/githubOctokit/CommitAdapter';
import { Pipeline } from './adapter/endpoint-adapter/helpers/pipleine';
import { IConfigGithubOctokit } from './adapter/endpoint-adapter/adapters/githubOctokit/config/IConfigGithubOctokit';
import { Observable, pipe } from 'rxjs';
import { Console } from 'console';

let flags: any;

function main() {
    parseArgs();
    dotenv.config()
    // const ouputAdapter = new OutputJSON();
    // const indexer = new Indexer(ouputAdapter)
    // const githubOctokitIssueAdapter = new GithubOctokitIssueAdapter();
    // const githubOctokitCommitAdapter = new GithubOctokitCommitAdapter();
    // const githubOctokitActionsAdapter = new GithubOctokitActionsAdapter();
    const config = {
        owner: flags.owner,
        repo: flags.repo,
        privateAccessToken: process.env.PATOKEN
    };
    // const issueObservable = githubOctokitIssueAdapter.fetchIssues(config);
    // const commitObservable = githubOctokitCommitAdapter.fetchCommits(config);
    // indexer.indexIssues(issueObservable);
    // indexer.indexCommits(commitObservable);
    // githubOctokitEndpointAdapter.fetchActions({
    //     owner: flags.owner,
    //     repo: flags.repo,
    //     privateAccessToken: process.env.PATOKEN
    // }).subscribe(console.log);
    const pipeline = new Pipeline<IConfigGithubOctokit, Branch[]>(config);
    pipeline
        .start(fetchBranches)
        .then(fetchCommits)
        .output({next: console.log,});
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main();
