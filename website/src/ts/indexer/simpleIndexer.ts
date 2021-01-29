import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find'
const db = new PouchDB('project.db');
// db.bulkDocs(commit);
// db.bulkDocs(issues);

export class SimpleIndexer {
    private db: any;
    constructor() {
        this.db = new PouchDB('project.db');
        // PouchDB.plugin('relational-pouch');
        PouchDB.plugin(PouchFind);
        // PouchDB.plugin(require('pouchdb-silverlining')); 
    }

    public importFile(files: File[]) {
        Array.from(files).forEach(f => {
            // @ts-ignore
            const file = require(f.name);
            console.log(file);
        });
    }
}

// // @ts-ignore
// db.sql("SELECT * FROM product").then(console.log);
