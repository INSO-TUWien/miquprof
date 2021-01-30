// db.bulkDocs(commit);
// db.bulkDocs(issues);

import { DatabaseHandler } from "../DatabaseHandler";


export class JSONImporter {
    private dbHandler: DatabaseHandler;
    private reader: FileReader;
    
    constructor(dbHandler: DatabaseHandler) {
        this.dbHandler = dbHandler;
        this.reader = new FileReader();
        this.reader.onerror = console.log;
    }

    public importFiles(files: File[]) {
        if (files.length <= 0) {
            return;
        }
        const file = files.pop();
        this.reader.onload = () => {
            const type = file?.name.split('-')[0];
            if (this.reader.result && (type === 'Branch' || type === 'Commit' || type === 'Issue' || type === 'Workflow')) {
                this.dbHandler.import(type, JSON.parse(this.reader.result?.toString()));
            }
            this.importFiles(files);
        };
        if (file !== undefined) {
            this.reader.readAsText(file);
        }
    }
}

// // @ts-ignore
// db.sql("SELECT * FROM product").then(console.log);
