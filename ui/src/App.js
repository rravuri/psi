import React from "react";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

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
  const classes = useStyles();
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.checking ? <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>: (
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/register",
              state: { from: location }
            }}
          />
        ))
      }
    />
  );
}
export default App;
