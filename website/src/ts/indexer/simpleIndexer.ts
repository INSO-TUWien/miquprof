import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find'
const db = new PouchDB('project.db');
// db.bulkDocs(commit);
// db.bulkDocs(issues);

export class SimpleIndexer {
    private db: any;
    private reader: FileReader;
    constructor() {
        this.db = new PouchDB('project.db');
        // PouchDB.plugin('relational-pouch');
        PouchDB.plugin(PouchFind);
        // PouchDB.plugin(require('pouchdb-silverlining')); 
        this.reader = new FileReader();
        this.reader.onerror = console.log;
    }

    public importFiles(files: File[]) {
        if (files.length <= 0) {
            return;
        }
        const file = files.pop();
        this.reader.onload = () => {
            console.log(this.reader.result);
            this.importFiles(files);
        };
        if (file !== undefined) {
            this.reader.readAsText(file);
        }
    }



}

// // @ts-ignore
// db.sql("SELECT * FROM product").then(console.log);
