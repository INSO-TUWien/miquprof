import {IOutputAdapter} from "./IOutputAdapter";
import {Commit} from "../indexer-adapter/outputModels/Commit";
import {Issue} from "../indexer-adapter/outputModels/Issue";
import {User} from "../indexer-adapter/outputModels/User";
import * as fs from "fs";
import * as fsextra from "fs-extra"

export class OutputJSON implements IOutputAdapter{
    private issues: Issue[] = [];
    private users: User[] = [];
    private commits: Commit[] = [];

    exportCommit(commit: Commit): void {
        this.commits.push(commit);
    }

    exportIssue(issue: Issue): void {
        this.issues.push(issue);
    }

    exportUser(user: User): void {
        this.users.push(user);
    }

    close(): void {
        const outputDir = process.env.OUT !== undefined? process.env.OUT : "~/tmp"
        console.log(outputDir)
        fsextra.ensureDirSync(outputDir);
        console.log("Exported:")
        fs.writeFile(`${process.env.OUT}/issues.json`, JSON.stringify(this.issues),err => {
            if (err) throw err;
            console.log("\tissues.json");
        });
        fs.writeFile(`${process.env.OUT}/commits.json`, JSON.stringify(this.commits),err => {
            if (err) throw err;
            console.log("\tcommits.json");
        });
    }
}