import args from 'args';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { OutputJSON } from './adapter/oultput-adapter/Output';
import { ActionAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/ActionAdapter';
import { IssueAdapter } from './adapter/endpoint-adapter/adapters/githubOctokit/IssueAdapter';

import { BranchAdapter } from "./adapter/endpoint-adapter/adapters/githubIsomorphicGit/BranchAdapter";
import { exit } from 'process';


let flags: any;

async function main() {
    // TODO: add progress bar or some loading indication
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

    const branchAdapter = new BranchAdapter(config);
    const actionAdapter = new ActionAdapter(config, octokit);
    const issueAdapter = new IssueAdapter(config, octokit);

    const branchesCommits = await branchAdapter.fetchBranches();
    const workflows = await actionAdapter.fetch();
    const issues = await issueAdapter.fetchIssues();

    
    await outputAdapter.export(branchesCommits.branches, "Branch", b => b.name);
    await outputAdapter.export(branchesCommits.commits, "Commit", b => b.oid);
    await outputAdapter.export(workflows, "Workflow", w => w.id.toString());
    await outputAdapter.export(issues, 'Issue', (i) => i.id.toString())
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main().then(() => exit(0));
