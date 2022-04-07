import * as fs from "fs/promises";
import * as fsextra from "fs-extra"

export class OutputJSON{
    private exportStarted = false;

    public async export<A>(exportObjs: A[], type: 'Branch' | 'Commit' | 'Issue' | 'Workflow' | 'Action', nameFn: (a: A) => string) {
        await Promise.all(await exportObjs.map(obj => this.write(obj, `${type}-${nameFn(obj)}`)));
    }

    private async write(obj: any, filename: string) {
        const outputDir = process.env.OUT !== undefined? process.env.OUT : "tmp"
        if (!this.exportStarted) {
            console.log(`Output dir: ${outputDir}`)
            fsextra.ensureDirSync(outputDir);
            console.log("Exported:")
            this.exportStarted = true;
        }
        try {
            await fs.writeFile(`${outputDir}/${encodeURIComponent(filename)}.json`, JSON.stringify(obj));
            console.log(`\t${filename}.json`);
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
}