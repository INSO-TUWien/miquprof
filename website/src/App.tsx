import {  useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { DatabaseHandler } from './DatabaseHandler';
import { JSONImporter } from './indexer/JSONImporter';
import './App.css';

import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-beautify'

function App() {
  const dbHandler = DatabaseHandler.getIntance();
  const importer = JSONImporter.getIntance(dbHandler);
  const [state, setState] = useState({ code: `issues.createIndex({
  index: {fields: ['title']}
}).then(() => {
  issues.find({
    selector: {title: {$gt: null}},
    sort: ['title']
  }).then((i) => {
    setResult(i.docs.map(issue => issue.title));
  })
});
`, result: '{}', dbHandler, importer})
  const setCode = (code: string) => setState({
    code,
    result: state.result,
    dbHandler: state.dbHandler,
    importer: state.importer
  });
  const setResult = (result: any) => {
    setState({
      code: state.code,
      result: JSON.stringify(result, undefined, 4),
      dbHandler: state.dbHandler,
      importer: state.importer
    })
  }

  const evalFunction = async () => {
    try {
      const branches = dbHandler.getDB('Branch');
      const commits = dbHandler.getDB('Commit');
      const issues = dbHandler.getDB('Issue');
      const workflows = dbHandler.getDB('Workflow');
      let result;
      eval(state.code);
      setResult(result);
    } catch (e: any) {
      setResult(e.message);
    }
  };
  return (
    <div>
    <AceEditor
        style={{
            height: '100vh',
            width: '50%',
            display: 'inline-block',
        }}
        placeholder='Start Coding'
        mode='typescript'
        theme='monokai'
        name='basic-code-editor'
        onChange={currentCode => setCode(currentCode)}
        fontSize={18}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={state.code}
        setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 4,
        }}
    />
    <AceEditor
    style={{
        height: '100vh',
        width: '50%',
        display: 'inline-block',
    }}
    placeholder='Start Coding'
    mode='json'
    theme='monokai'
    name='basic-code-editor'
    fontSize={18}
    showPrintMargin={true}
    showGutter={true}
    highlightActiveLine={true}
    value={state.result}
    setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        readOnly: true,
        tabSize: 4,
    }}
/>
<button className='run-button' onClick={ () => { evalFunction()} }>Run</button>
<input id="fileInput" className='import-button' type='file' onChange={(ev) => {
  if (ev.target && ev.target.files) {
    importer.importFiles(Array.from(ev.target.files ?? []));
  } 
}} accept="json" multiple/>
</div>
)
}

export default App;
