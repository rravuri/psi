import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  Redirect,
  useLocation
} from "react-router-dom";
import queryString from 'query-string';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  placeholder: {
    height: 40,
    textAlign: 'center',
  },
}));

function TimedRedirect({children, delay, to, ...otherProps}) {
  const [redirectTimer, setRTimer] = useState(delay);
  useEffect(()=>{
    let rthandle = setInterval(()=>{
      if (redirectTimer>0) {
        setRTimer(redirectTimer-1);
      } else {
        clearInterval(rthandle);
      }
    }, 1000)
    return ()=>{clearInterval(rthandle);}
  });
  return redirectTimer<=0?<Redirect to={to} {...otherProps}/>:<div>
    {children}
    <Typography variant='subtitle'>
      {`redirecting in ${redirectTimer} seconds...`}
    </Typography>
  </div>
}

function Verify() {
  let location = useLocation();
  const [isBusy, setBusy] = useState(true);
  const [token, setToken] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  const classes = useStyles();

  const verifyToken = (token)=>{
    console.log('verifing token: '+token);
    setBusy(true);
    axios.get(`/api/user/verify?token=${token}`)
    .then(res=>{
      let token = res.data.jwt;
      window.localStorage.setItem('lc', token);
      console.log('verified the token.')
      setCompleted(true);
      setBusy(false);
    })
    .catch(err=>{
      console.error(err);
      setCompleted(false);
      let errorMsg = `Unable to validate the token:${token}. `;

      if (err.status===400) {
        errorMsg+=err.error;
      }

      setError(errorMsg);
      setBusy(false);
    })
  }

  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    if (parsed.token) {
      verifyToken(parsed.token);
    }
  },[location]);

  const onTokenChanged = (e) => {
    setToken(e.target.value);
  }

  const onVerify = (e)=>{
    e.preventDefault();
    verifyToken(token);
  }

  if (isBusy) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box mt={8}>
          <div className={classes.placeholder}>
              <CircularProgress />
          </div>
        </Box>
      </Container>
    )
  }

  if (completed) {
    return (
      <TimedRedirect push to='/' delay={3}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <CheckCircleIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Successfully verified the email.
            </Typography>
          </div>
        </Container>
      </TimedRedirect>
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Verify Token
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="token"
            label="Token"
            name="token"
            autoFocus
            value={token}
            onChange={onTokenChanged}
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onVerify}
            >
              Verify
          </Button>
          {error!==''?<Alert severity="error">{error}</Alert>:null}
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2">
          ☞ on <a href="/register">registration</a> a link will be emailed. On clicking this link you will have access to the content in this site.
        </Typography>
      </Box>
    </Container>
  )
}

export default Verify;