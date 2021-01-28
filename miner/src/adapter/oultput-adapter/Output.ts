import * as fs from "fs";
import * as fsextra from "fs-extra"
import { Branch } from "../endpoint-adapter/adapters/githubOctokit/BranchAdapter";
import { Commit } from "../endpoint-adapter/adapters/githubOctokit/CommitAdapter";

export class OutputJSON{
    private exportStarted = false;

    public exportCommit(commits: Commit[]): void {
        commits.forEach(commit => this.write(commit, `Commit-${commit.id}`));
    }

    public exportBranch(branches: Branch[]): void {
        branches.forEach(branch => this.write(branch, `Branch-${branch.sha}`));
    }

    // exportIssue(issue: Issue): void {
    //     this.issues.push(issue);
    // }

    // exportUser(user: User): void {
    //     this.users.push(user);
    // }

    public write(obj: any, filename: string) {
        const outputDir = process.env.OUT !== undefined? process.env.OUT : "tmp"
        if (!this.exportStarted) {
            console.log(outputDir)
            fsextra.ensureDirSync(outputDir);
            console.log("Exported:")
            this.exportStarted = true;
        }
        fs.writeFile(`${outputDir}/${filename}.json`, JSON.stringify(obj),err => {
            if (err) throw err;
            console.log("\b" + `${filename}.json`);
        });
    }
}