import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find'

export type DataTypes = 'Branch' | 'Commit' | 'Issue' | 'Workflow';

export class DatabaseHandler {
    private branchDB: any;
    private commitDB: any;
    private issueDB: any;
    private workflowDB: any;

    constructor() {
        PouchDB.plugin(PouchFind);
        this.createDB().then(console.log);
    }

    public import(type: DataTypes, data: any) {
        const db = this.getDB(type);
        if (!db) {
            return;
        }

        const doc = {
            ...data,
            _id: data.id.toString()
        };
        try {
            db.put(doc);
        } catch (e)  {
            console.log(e);
        }
    }

    public getDB(type: DataTypes): any {
        switch (type) {
            case 'Branch':
                return this.branchDB;
            case 'Commit':
                return this.commitDB
            case 'Issue':
                return this.issueDB;
            case 'Workflow':
                return this.workflowDB;
            default:
                return undefined;
        }
    }

    private async createDB() {
        this.branchDB = new PouchDB('branch.db');
        await this.branchDB.destroy();
        this.branchDB = new PouchDB('branch.db');
        this.commitDB = new PouchDB('commit.db');
        await this.commitDB.destroy();
        this.commitDB = new PouchDB('commit.db');
        this.issueDB = new PouchDB('issue.db');
        await this.issueDB.destroy();
        this.issueDB = new PouchDB('issue.db');
        this.workflowDB = new PouchDB('workflow.db');
        await this.workflowDB.destroy();
        this.workflowDB = new PouchDB('workflow.db');
        return 'DBs are ready!'
    }
}