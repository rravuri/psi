import React, {useState} from 'react';
import axios from 'axios';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';

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

function Register() {
  const [email, setEmail] = useState('');
  const [isBusy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  const classes = useStyles();

  const onEmailChanged = (e)=>{
    setEmail(e.target.value);
  };

  const onRegister=(e)=>{
    e.preventDefault();
    setBusy(true);
    axios.post('/api/user/register', { email })
      .then(res=>{
        setBusy(false);
        setCompleted(true);
        setError('');
        console.log(res);
      })
      .catch(err=>{
        setBusy(false);
        setCompleted(false);
        let errorMsg = 'Unable to register. Please try again.';
        if (err.response) {
          if (err.response.status===400){
            errorMsg = 'Invalid email value. Please specify a valid email and try again.';
          }
        }
        setError(errorMsg);
        console.error(err.message);
      })
  };

  if (isBusy) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box mt={8}>
          <div className={classes.placeholder}>
            <Fade
              in={isBusy}
              style={{
                transitionDelay: isBusy ? '200ms' : '0ms',
              }}
              unmountOnExit
            >
              <CircularProgress />
            </Fade>
          </div>
        </Box>
      </Container>
    )
  }

  if (completed) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box mt={8}>
          <Typography variant="title">
            Successfully registered.
          </Typography>
          <Typography variant="subtitle1">
            Please verify your email by clicking on the link sent to {email}.
          </Typography>
        </Box>
      </Container>

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
          Register
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onEmailChanged}
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onRegister}
            >
              Register
          </Button>
          {error!==''?<Alert severity="error">{error}</Alert>:null}
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2">
          ☞ on registration a link will be emailed. On clicking this link you will have access to the content in this site.
        </Typography>
      </Box>
    </Container>
  )
}

export default Register;