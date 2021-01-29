import * as fs from "fs";
import * as fsextra from "fs-extra"

export class OutputJSON{
    private exportStarted = false;

    public export<A>(exportObjs: A[], type: 'Branch' | 'Commit' | 'Issue' | 'Workflow' | 'Action', nameFn: (a: A) => string): void {
        exportObjs.forEach(obj => this.write(obj, `${type}-${nameFn(obj)}`));
    }

    private write(obj: any, filename: string) {
        const outputDir = process.env.OUT !== undefined? process.env.OUT : "tmp"
        if (!this.exportStarted) {
            console.log(`Output dir: ${outputDir}`)
            fsextra.ensureDirSync(outputDir);
            console.log("Exported:")
            this.exportStarted = true;
        }
        fs.writeFile(`${outputDir}/${filename}.json`, JSON.stringify(obj),err => {
            if (err) throw err;
            console.log(`\t${filename}.json`);
        });
    }
}