import args from 'args';
import dotenv from 'dotenv';
import { Pipeline } from './adapter/endpoint-adapter/helpers/pipleine';
import { Octokit } from '@octokit/rest';
import { OutputJSON } from './adapter/oultput-adapter/Output';
import { ActionAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/ActionAdapter';
import { fetchIssues } from './adapter/endpoint-adapter/adapters/githubOctokit/IssueAdapter';

let flags: any;

function main() {
    parseArgs();
    dotenv.config();
    // const indexer = new Indexer(ouputAdapter)
    // const githubOctokitIssueAdapter = new GithubOctokitIssueAdapter();
    // const githubOctokitCommitAdapter = new GithubOctokitCommitAdapter();
    // const githubOctokitActionsAdapter = new GithubOctokitActionsAdapter();
    const config = {
        owner: flags.owner,
        repo: flags.repo,
        privateAccessToken: process.env.PATOKEN
    };
    const octokit = new Octokit({
        auth: `token ${config.privateAccessToken}`
      });

    const ouputAdapter = new OutputJSON();
    // Pipeline
    //     .start(() => fetchBranches(config, octokit))
    //     .nextSplit(indexBranches, { next: branches => ouputAdapter.exportBranch(branches) })
    //     .next((pipeline) => (new CommitAdapter(config, octokit)).fetchCommits(pipeline))
    //     .output({next: (commits) => ouputAdapter.exportCommit(commits)});
        
    // Pipeline
    //     .start(() => new ActionAdapter(config, octokit).fetch())
    //     .output({next: data => console.log(JSON.stringify(data, null, 1))});;

    Pipeline
        .start(() => fetchIssues(config, octokit))
        .output({next: data => console.log(JSON.stringify(data, null, 1))});
    
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main();
