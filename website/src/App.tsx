import { useState } from 'react';
import AceEditor from 'react-ace';
import './App.css';

import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/ext-beautify'

function App() {
  const [state, setState] = useState({ code: `function hello() {
    console.log("Hello World!");
  }`, result: `{
    test: 'test',
    result: [
      'a',
      'b',
      'c'
    ]
}`})
  const setCode = (code: string) => setState({
    code,
    result: state.result
  });
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
<button className='run-button' onClick={() => console.log('beep')}>Run</button>
</div>
)
}

export default App;
