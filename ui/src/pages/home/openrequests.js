import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Avatar, Backdrop, Badge, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Grow, IconButton, InputBase, ListItemIcon, ListItemSecondaryAction, TextField, Toolbar, Typography } from "@material-ui/core";
import CityDropdown from "../../components/citydropdown";
import { useAuth } from "../../useauth";
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import SearchIcon from '@material-ui/icons/Search';
import CommentIcon from '@material-ui/icons/Comment';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ReplyIcon from '@material-ui/icons/Reply';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { fade, makeStyles } from '@material-ui/core/styles';
import { DateTimePicker } from '@material-ui/pickers'
import { format, formatDistance} from 'date-fns';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    }
    ,backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  },
}));

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function OpenRequests({city}) {
  const auth = useAuth();
  const [from, setFrom] = useState(auth.user.email);
  const [category, setCategory] = useState('info');
  const [rcity, setrcity] = useState({city:"", state:""});
  const [desc, setDesc] = useState(null);
  const [nbtime, setNBTime] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [error, setError] = useState(null);

  const [isBusy, setBusy] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [requests, setRequests] =useState([]);
  const classes = useStyles();

  useEffect(()=>{
    setrcity(city)
    axios.get(`/api/request/`)
      .then(res=>{
        setRequests(res.data);
      })
      .catch(err=>{
        console.log(err);
        setRequests([]);
      })
  },[city])

  const handleCategoryChange = (e)=>{
    setCategory(e.target.value);
  }

  const handleNewDiaglogClose = ()=>{
    setOpenNewDialog(false);
  }

  const handleSubmitNewRequest=(e)=>{
    e.preventDefault();
    try{
      setBusy(true);
      axios.post('/api/request',{
        category,
        from,
        city: rcity.city,
        description: desc,
        needByTime: nbtime,
        contactNumber
      }).then(res=>{
        setRequests([res.data, ...requests]);
        setOpenNewDialog(false);
        setError(null);
        setBusy(false);
      }).catch(err=>{
        console.log(err);
        setError('Unable to add request.')
      })
    } catch (ex) {
      console.error(ex);
    }
  }

  return <div>
    <AppBar position="static">
      <Toolbar variant="dense">
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="add ne request" color="inherit" onClick={()=>setOpenNewDialog(true)} >
              <NoteAddIcon />
            </IconButton>
          </div>
      </Toolbar>
    </AppBar>
    <Container>
      <Box component="div">
        <List className={classes.list}>
          {requests.map((r,i)=>{return <React.Fragment key={r.id}>
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              <Checkbox
                edge="start"
                icon={<ArrowRightIcon/>}
                checkedIcon={<ArrowDropDownIcon/>}
              />
            </ListItemIcon>
            <ListItemAvatar>
              <Badge badgeContent={r.replyCount} max={10} color="secondary" >
                <Avatar alt="r.category">{r.category[0].toUpperCase()+''}</Avatar>
              </Badge> 
            </ListItemAvatar>
            <ListItemText
              primary={r.description}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {formatDistance(new Date(r.createdAt["_seconds"]*1000), new Date(), {addSuffix: true})}
                  </Typography>
                  &nbsp;&nbsp;{`${r.from}, ${r.city}`}
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="reply">
                <ReplyIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          </React.Fragment>;})}
        </List>
      </Box>
    </Container>
    <Dialog open={openNewDialog} onClose={handleNewDiaglogClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmitNewRequest}>
          <DialogTitle id="form-dialog-title">Add a new request</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you have a request for help from our volunteers? Please, add it!
            </DialogContentText>
            <Grid container spacing={1}>
              <Grid item xs={12}> 
              <FormControl component="fieldset">
                <FormLabel component="legend">Category</FormLabel>
                <RadioGroup row aria-label="category" name="category1" value={category} onChange={handleCategoryChange}>
                  <FormControlLabel value="info" control={<Radio />} label="Info" />
                  <FormControlLabel value="oxygen" control={<Radio />} label="Oxygen" />
                  <FormControlLabel value="bed" control={<Radio />} label="Bed" />
                  <FormControlLabel value="medicines" control={<Radio />} label="Medicines" />
                  <FormControlLabel value="food" control={<Radio />} label="Food" />
                  <FormControlLabel value="transport" control={<Radio />} label="Transport" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                  {/* <FormControlLabel value="medicine" disabled control={<Radio />} label="(Disabled option)" /> */}
                </RadioGroup>
              </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  id="from"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  label="from"
                  type="email"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <CityDropdown cityValue={rcity} onChange={(c)=>setrcity(c)} variant={'standard'}/>
              </Grid>
              <Box p={1}/>
              <Grid item xs={12}>
                <TextField
                  id="descrip"
                  label="Description"
                  multiline
                  rows={4}
                  defaultValue="Request Description..."
                  variant="outlined" 
                  fullWidth
                  value={desc}
                  onChange={(event) => setDesc(event.target.value)}
                />
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <DateTimePicker 
                  autoOk
                  ampm={false}
                  fullWidth
                  label='Need by time'
                  inputVariant='standard'
                  showTodayButton
                  value={nbtime} onChange={(d)=>setNBTime(d)}/>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewDiaglogClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Backdrop className={classes.backdrop} open={isBusy}>
        <CircularProgress color="inherit" />
      </Backdrop>
  </div>
}