import React, { Fragment, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Users from "./Users/Users";
import axios from "axios";
import Search from "./Users/Search";
import Alert from "./layout/Alert";
import About from "./Components/pages/About";
import User from "./Users/User";
import GithubState from "./context/github/GithubState";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Search Github users
  const searchUsers = async (text) => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}`,
      {
        headers: {
          Authorization: `${process.env.REACT_APP_GITHUB_CLIENT_ID}: ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
        },
      }
    );
    setUsers(res.data.items);
    setLoading(false);
  };
  // Get a single Gihub user
  const getUser = async (username) => {
    setLoading(true);
    const res = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `${process.env.REACT_APP_GITHUB_CLIENT_ID}: ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
      },
    });
    setUser(res.data);
    setLoading(false);
  };
  //  Gets users repos
  const getUserRepos = async (username) => {
    setLoading(true);
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`,
      {
        headers: {
          Authorization: `${process.env.REACT_APP_GITHUB_CLIENT_ID}: ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
        },
      }
    );
    setRepos(res.data);
    setLoading(false);
  };
  // Clear users from state
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };
  // Set alert
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => {
      setAlert(null);
    }, 1000);
  };

  return (
    <GithubState>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={alert} />
            <Switch>
              <Route
                path="/"
                exact
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={searchUsers}
                      clearUsers={clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={showAlert}
                    />
                    <Users users={users} loading={loading} />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/user/:login"
                render={(props) => (
                  <User
                    {...props}
                    getUser={getUser}
                    getUserRepos={getUserRepos}
                    user={user}
                    loading={loading}
                    repos={repos}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
