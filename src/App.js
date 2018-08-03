import React, { Component } from 'react';
import Login from './components/Login';
import Story from './components/Story';
import Problem from './components/Problem';
import AdminMain from './components/admin/Main'

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AdminMain />
      </div>
    );
  }
}

export default App;
