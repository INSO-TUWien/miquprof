import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find'


export class DatabaseHandler {
    private db: any;
    constructor() {
        PouchDB.plugin(PouchFind);
        this.db = new PouchDB('project.db');
        this.db.destroy().then(() => {
            this.db = new PouchDB('project.db');
        })
    }

    public getDB() {
        return this.db;
    }

    public import(type: 'Branch' | 'Commit' | 'Issue' | 'Workflow', data: any) {
        const doc = {
            ...data,
            _id: data.id.toString()
        };
        this.db.put(doc);
    }
}