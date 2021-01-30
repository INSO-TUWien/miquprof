import { DatabaseHandler } from './DatabaseHandler';
import { JSONImporter } from './indexer/JSONImporter';

class Main {
    private dbHandler;
    constructor() {
        this.dbHandler = new DatabaseHandler();
        const importer = new JSONImporter(this.dbHandler);
        
        // @ts-ignore
        const editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/typescript");
        editor.session.setTabSize(4);
        // register handler for file import
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (ev: any) => {
                if (ev.target && ev.target.files) {
                    importer.importFiles(Array.from(ev.target.files));
                }
            });
        }
        
        // register handler for run button
        const runButton = document.getElementById('run');
        if (runButton) {
            runButton.addEventListener('click', (ev: any) => {
                const input = document.getElementById('editor');
                if (input) {
                    this.executeQuery(editor.getValue());
                }
            });
        }
    }

    private async executeQuery(q: string) {
        const db = this.dbHandler.getDB();
        let result;
        eval(`(${q})().then(console.log)`);
        // @ts-ignore
        console.log(result);
    }
}

new Main();

