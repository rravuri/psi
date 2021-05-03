import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

import { useAuth, ProvideAuth } from "./useauth.js";

import Home from './pages/home';
import Register from './pages/register';
import Verify from './pages/verify';

function App() {
  return (
    <ProvideAuth>
      <Router>
        <Switch>
          <Route path="/verify">
            <Verify />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/">
            <Home />
          </PrivateRoute>
        </Switch>
      </Router>
    </ProvideAuth>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/register",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
export default App;
