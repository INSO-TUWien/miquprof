import args from 'args';
import dotenv from 'dotenv';
import { GithubOctokit } from "./endpoint-adapter/Adapters/GithubOctokit/GithubOctokit";

let flags: any;

function main() {
    parseArgs();
    dotenv.config()
    const githubOctokitEndpointAdapter = new GithubOctokit();
    let i = 0;
    githubOctokitEndpointAdapter.fetchIssues({
        owner: flags.owner,
        repo: flags.repo,
        privateAccessToken: process.env.PATOKEN
    }).subscribe(console.log);
}

function parseArgs() {
    args.option('owner', 'Name of the repository owner', 'octokit')
        .option('repo', 'Name of the repository', "graphql.js")
        .option('output','path to folder where the output files should be saved', './output/miner');
    flags = args.parse(process.argv);
}

main();
