import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find'
// @ts-ignore
PouchDB.plugin('relational-pouch');
PouchDB.plugin(PouchFind);
PouchDB.plugin(require('pouchdb-silverlining'));
const db = new PouchDB('project.db');
const commit = require("../../../out/commits.json");
const issues = require("../../../out/issues.json");
db.bulkDocs(commit);
db.bulkDocs(issues);

// @ts-ignore
db.sql("SELECT * FROM product").then(console.log);
