import React, { Component } from 'react';
import Login from './components/Login';
import Story from './components/Story';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Story />
      </div>
    );
  }
}

export default App;
