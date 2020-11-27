import args from 'args';
import dotenv from 'dotenv';
import { GithubOctokitIssueAdapter } from "./adapter/endpoint-adapter/adapters/githubOctokit/GithubOctokitIssueAdapter";
import {GithubOctokitCommitAdapter} from "./adapter/endpoint-adapter/adapters/githubOctokit/GithubOctokitCommitAdapter";
import {Indexer} from "./adapter/indexer-adapter/Indexer";
import {OutputJSON} from "./adapter/oultput-adapter/Output";

let flags: any;

function main() {
    parseArgs();
    dotenv.config()
    const ouputAdapter = new OutputJSON();
    const indexer = new Indexer(ouputAdapter)
    const githubOctokitIssueAdapter = new GithubOctokitIssueAdapter();
    const githubOctokitCommitAdapter = new GithubOctokitCommitAdapter();
    const issueObservable = githubOctokitIssueAdapter.fetchIssues({
        owner: flags.owner,
        repo: flags.repo,
        privateAccessToken: process.env.PATOKEN
    });
    const commitObservable = githubOctokitCommitAdapter.fetchCommits({
        owner: flags.owner,
        repo: flags.repo,
        privateAccessToken: process.env.PATOKEN
    });
    indexer.indexIssues(issueObservable);
    indexer.indexCommits(commitObservable);
    // githubOctokitEndpointAdapter.fetchActions({
    //     owner: flags.owner,
    //     repo: flags.repo,
    //     privateAccessToken: process.env.PATOKEN
    // }).subscribe(console.log);
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main();
