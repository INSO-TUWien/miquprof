import args from 'args';
import dotenv from 'dotenv';
import { Pipeline } from './adapter/endpoint-adapter/helpers/pipleine';
import { Octokit } from '@octokit/rest';
import { OutputJSON } from './adapter/oultput-adapter/Output';
import { fetchBranches } from './adapter/endpoint-adapter/adapters/githubOctokit/BranchAdapter';
import { indexBranches } from './adapter/indexer-adapter/branchIndexer';
import { CommitAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/CommitAdapter';

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
    // Pipeline
    //     .start(() => fetchBranches(config, octokit))
    //     .nextSplit(indexBranches, { next: branches => outputAdapter.export(branches, 'Branch', (b) => b.id) })
    //     .next((pipeline) => (new CommitAdapter(config, octokit)).fetchCommits(pipeline))
    //     .output({next: (commits) => outputAdapter.export(commits, 'Commit', (c) => c.id)});
        
    // Pipeline
    //     .start(() => new ActionAdapter(config, octokit).fetch())
    //     .output({next: workflow => outputAdapter.export(workflow, 'Workflow', (w) => w.id.toString())});;

    // Pipeline
    //     .start(() => fetchIssues(config, octokit))
    //     .output({next: (issue) => outputAdapter.export(issue, 'Issue', (i) => i.id.toString())});
    
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main();
