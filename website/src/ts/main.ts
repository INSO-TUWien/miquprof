import { SimpleIndexer } from '../ts/indexer/simpleIndexer'

const indexer = new SimpleIndexer();
const elem = document.getElementById('fileInput');

if (elem) {
    elem.addEventListener('change', (ev: any) => {
        if (ev.target && ev.target.files) {
            indexer.importFiles(Array.from(ev.target.files));
        }
    });
}