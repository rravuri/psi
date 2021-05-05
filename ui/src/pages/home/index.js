import React, {useEffect, useState} from 'react';
import axios from 'axios';

import AppBar from '@material-ui/core/AppBar';
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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import CityDropdown from '../../components/citydropdown';
import OpenRequests from './openrequests';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow:1,
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
  tabpanel: {
    display:'flex',
    flexDirection:'column',
    width: '100%'
  },
}));


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

function Home() {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [city, setCity] = useState({city:'', state:''});
  const handleChange = (_e, newValue)=>{
    setSelectedTab(newValue);
  }

  return (
  <Container component="main">
    <CssBaseline />
    <div className={classes.paper}>
      <Typography component='h1' variant='h5'>PS4U</Typography>
      <Typography variant='title'>Covid-19 support portal</Typography>
      <CityDropdown cityValue={city} onChange={setCity}/>
      <AppBar position="static" color="transparent" elevation={0}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="on"
          aria-label="scrollable force tabs categories"
        >
          <Tab label="Requests" {...a11yProps(0)}/>
          <Tab label="Oxygen" {...a11yProps(1)}/>
          <Tab label="Beds" {...a11yProps(2)}/>
          <Tab label="Plasma" {...a11yProps(3)}/>
          <Tab label="Medicines" {...a11yProps(4)}/>
          <Tab label="Food" {...a11yProps(5)}/>
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0} className={classes.tabpanel}>
        <OpenRequests city={city}/>
      </TabPanel>
      <TabPanel value={selectedTab} index={1} className={classes.tabpanel}>
        <Typography variant='title'>Oxygen Information</Typography>

      </TabPanel>
      <TabPanel value={selectedTab} index={2} className={classes.tabpanel}>
        <Typography variant='title'>Beds Information</Typography>

      </TabPanel>
      <TabPanel value={selectedTab} index={3} className={classes.tabpanel}>
        <Typography variant='title'>Plasma Information</Typography>

      </TabPanel>
      <TabPanel value={selectedTab} index={4} className={classes.tabpanel}>
        <Paper>
          <Typography variant='title'>Medicines Information</Typography>
        </Paper>
      </TabPanel>
      <TabPanel value={selectedTab} index={5} className={classes.tabpanel}>
        <Paper>
          <Typography variant='title'>Food Information</Typography>
        </Paper>
      </TabPanel>
    </div>
  </Container>
  )
}

export default Home;