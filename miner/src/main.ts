import args from 'args';
import dotenv from 'dotenv';
import { Pipeline } from './adapter/endpoint-adapter/helpers/pipleine';
import { Octokit } from '@octokit/rest';
import { OutputJSON } from './adapter/oultput-adapter/Output';
import { CommitAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/CommitAdapter';
import { ActionAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/ActionAdapter';
import { fetchIssues } from './adapter/endpoint-adapter/adapters/githubOctokit/IssueAdapter';
import { BranchAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/BranchAdapter';

let flags: any;

function main() {
    // TODO: add progress bar or some loading indication
    // TODO: increase fetches per page
    parseArgs();
    dotenv.config();
    const config = {
        owner: flags.owner,
        repo: flags.repo,
        privateAccessToken: process.env.PATOKEN
    };
    const octokit = new Octokit({
        auth: `token ${config.privateAccessToken}`
      });
    const outputAdapter = new OutputJSON();

    Pipeline
        .start(() => (new BranchAdapter(config, octokit)).fetchBranches(config, octokit))
        .nextSplit(
            (pipeline) => (new CommitAdapter(config, octokit)).fetchCommits(pipeline), 
            { next: branches => outputAdapter.export(branches, 'Branch', (b) => b.id) })
        .output({next: (commits) => outputAdapter.export(commits, 'Commit', (c) => c.id)});
        
    Pipeline
        .start(() => new ActionAdapter(config, octokit).fetch())
        .output({next: workflow => outputAdapter.export(workflow, 'Workflow', (w) => w.id.toString())});;

    Pipeline
        .start(() => fetchIssues(config, octokit))
        .output({next: (issue) => outputAdapter.export(issue, 'Issue', (i) => i.id.toString())});
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main();
