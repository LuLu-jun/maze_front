import React, { Component } from 'react';
import Login from './components/Login';
import Story from './components/Story';
import Problem from './components/Problem';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Problem />
      </div>
    );
  }
}

export default App;
