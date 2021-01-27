import args from 'args';
import dotenv from 'dotenv';
import { Branch, fetchBranches } from './adapter/endpoint-adapter/adapters/githubOctokit/BranchAdapter';
import { fetchCommitData, fetchCommitFiles, fetchCommits } from './adapter/endpoint-adapter/adapters/githubOctokit/CommitAdapter';
import { Pipeline } from './adapter/endpoint-adapter/helpers/pipleine';
import { IConfigGithubOctokit } from './adapter/endpoint-adapter/adapters/githubOctokit/config/IConfigGithubOctokit';
import { Octokit } from '@octokit/rest';

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
    const octokit = new Octokit({
        auth: `token ${config.privateAccessToken}`
      });
    const pipeline = new Pipeline<IConfigGithubOctokit, Octokit, Branch[]>(config, octokit);
    pipeline
        .start(fetchBranches)
        .then(fetchCommits)
        .then(fetchCommitData)
        .then(fetchCommitFiles)
        // .then(fetchCommitTrees)
        .output({next: data => console.log(JSON.stringify(data, null, 1))});
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main();
