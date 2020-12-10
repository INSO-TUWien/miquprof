import PouchDB from 'pouchdb';
let db = new PouchDB('project');
const commit = require("../../../out/commits.json");
const issues = require("../../../out/issues.json");
console.log(commit);