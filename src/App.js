import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';

import Main from './components/Main';
import Login from './components/Login';
import Home from './components/Home';
import Story from './components/Story';
import Problem from './components/Problem';
import AdminHome from './components/admin/Home';
import AdminClass from './components/admin/Class';
import AdminMember from './components/admin/Member';
import AdminPage from './components/admin/Page';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/login" component={Login} />
              <Route path="/home" component={Home} />
              <Route path="/problem/:num" component={Problem} />
              <Route path="/story/:num" component={Story} />
              <Route path="/admin/home" component={AdminHome} />
              <Route path="/admin/class" component={AdminClass} />
              <Route path="/admin/member" component={AdminMember} />
              <Route path="/admin/page" component={AdminPage} />
          </Switch>
      </div>
    );
  }
}

export default App;
