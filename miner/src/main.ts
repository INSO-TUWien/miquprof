import args from 'args';
import dotenv from 'dotenv';
import { fetchBranches } from './adapter/endpoint-adapter/adapters/githubOctokit/BranchAdapter';
import { Pipeline } from './adapter/endpoint-adapter/helpers/pipleine';
import { Octokit } from '@octokit/rest';
import { indexBranches } from './adapter/indexer-adapter/branchIndexer';
import { CommitAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/CommitAdapter';
import { OutputJSON } from './adapter/oultput-adapter/Output';

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
    Pipeline
        .start(() => fetchBranches(config, octokit))
        .nextSplit(indexBranches, { next: branches => ouputAdapter.exportBranch(branches) })
        .next((pipeline) => (new CommitAdapter(config, octokit)).fetchCommits(pipeline))
        .output({next: (commits) => ouputAdapter.exportCommit(commits)});
        
        // .then(fetchCommits)
        // .then(fetchCommitData)
        // .then(fetchCommitFiles)
        // .output({next: data => console.log(JSON.stringify(data, null, 1))});
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main();
