import React from 'react';
import './App.css';
import MyEditor from './components/MyEditor';
import 'draft-js/dist/Draft.css';

function App() {
  return (
    <div className="App">
      <div className="header">
        <h1 className="app-title">Demo editor by Sumedha</h1>
        <button className="save-button">Save</button>
      </div>
      <MyEditor />
    </div>
  );
}

export default App;
