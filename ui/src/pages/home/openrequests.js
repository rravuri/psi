import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Avatar, Backdrop, Badge, Button, ButtonGroup, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Grow, IconButton, InputBase, Link, ListItemIcon, ListItemSecondaryAction, TextField, Toolbar, Tooltip, Typography } from "@material-ui/core";
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
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
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

import SplitButton from '../../components/splitbutton';

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
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('xs')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
  }
  ,backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  listIcon:{
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  itemactions:{
    display:'flex', flexDirection:'row', 
    float:"right",
    paddingLeft: theme.spacing(1)
  },
  replyList: {
    width: '100%',
    paddingLeft: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
  }
}));

export default function OpenRequests({city}) {
  const auth = useAuth();
  const [from, setFrom] = useState(auth.user.email);
  const [category, setCategory] = useState('info');
  const [rcity, setrcity] = useState({city:"", state:""});
  const [desc, setDesc] = useState(null);
  const [nbtime, setNBTime] = useState(null);
  const [contactNumber, setContactNumber] = useState(null);
  const [requestedFor, setRequestedFor] = useState('self');
  const [replydesc, setReplyDesc] = useState(null);
  const [currentReq, setCurrentReq] = useState(null);
  const [error, setError] = useState(null);

  const [isBusy, setBusy] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openNewReplyDialog, setNewReplyDialog] = useState(false);
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

  const handleRequestedForCheck = (e)=>{
    setRequestedFor(e.target.checked?'self':'others');
  }
  const handleCategoryChange = (e)=>{
    setCategory(e.target.value);
  }

  const handleReplyDiaglogClose = ()=>{
    setNewReplyDialog(false);
  }

  const handleSubmitNewReply = (e)=>{
    e.preventDefault();
    try{
      setBusy(true);
      axios.post('/api/request',{
        from: auth.user.email,
        replyTo: currentReq?currentReq.id:null,
        description: replydesc,
      }).then((res) =>{
        currentReq.replies=[res.data, ...(currentReq.replies||[])]
        // setRequests([res.data, ...requests]);
        setNewReplyDialog(false);
        setError(null);
        setBusy(false);
      }).catch(err=>{
        console.log(err);
        setError('Unable to add request.')
      })
    } catch (ex) {
      console.error(ex);
      setBusy(false);
    }
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
      setBusy(false);
    }
  }

  return <div>
    <Container>
      <AppBar position="static">
        <Toolbar variant="dense">
            {/* <div className={classes.search}>
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
            </div> */}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Tooltip title="Add new request" >
                <IconButton aria-label="add new request" color="inherit" onClick={()=>setOpenNewDialog(true)} >
                  <NoteAddIcon />
                </IconButton>
              </Tooltip>
            </div>
        </Toolbar>
      </AppBar>
      <Box component="div">
        <List className={classes.list}>
          {requests.map((r)=>{return <RequestItem  key={r.id} request={r} 
            setCurrentReq={setCurrentReq} setNewReplyDialog={setNewReplyDialog}/>;
            })
          }
        </List>
      </Box>
    </Container>
    <Dialog open={openNewReplyDialog} onClose={handleReplyDiaglogClose} aria-labelledby="form-replydialog-title">
      <form onSubmit={handleSubmitNewReply}>
        <DialogTitle id="form-replydialog-title">Add a new request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you have a reply for this request? Please, add it!
          </DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                id="rdescrip"
                label="Reply"
                multiline
                rows={4}
                placeholder="Reply message..."
                variant="outlined" 
                fullWidth
                value={replydesc}
                onChange={(event) => setReplyDesc(event.target.value)}
              />
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
                  placeholder="Request Description..."
                  variant="outlined" 
                  fullWidth
                  value={desc}
                  onChange={(event) => setDesc(event.target.value)}
                />
              </Grid>
              <Grid item xs={6}> 
                <FormControlLabel
                  control={<Checkbox color="primary" checked={requestedFor==='self'} onChange={handleRequestedForCheck} />}
                  label="For Self?"
                />
              </Grid>
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

function RequestItem({request, setCurrentReq, setNewReplyDialog}) {
  const classes = useStyles();
  const [r, setcr] = useState(null);
  const [isBusy, setBusy] = useState(false);
  useEffect(()=>{
    let cr=Object.assign({}, request);
    if (!cr.replies) {
      cr.replies=[];
      cr.showReplies=false;
    }
    setcr(cr);
  },[request]);

  const handleShowReplies = (e)=>{
    if (e.target.checked) {
      setBusy(true);
      axios.get(`/api/request?parent=${r.id}`)
        .then(res=>{
          const cr=Object.assign({}, r)
          cr.replies=[...res.data];
          cr.showReplies=true;
          setcr(cr);
          setBusy(false);
        })
        .catch(err=>{
          console.log(err);
          setBusy(false);
        })
    } else {
      r.showReplies = false;
      setcr(Object.assign({}, r));
    }
  }
  if (r===null) return null;
  return <React.Fragment>
    <ListItem alignItems="flex-start">
      <ListItemIcon>
        <Badge badgeContent={r.replyCount} max={10} color="secondary">
        {isBusy?<CircularProgress />:<Checkbox
          edge="start"
          icon={<ArrowRightIcon />}
          checkedIcon={<ArrowDropDownIcon />}
          checked={r.showReplies}
          onChange={handleShowReplies} />}
        </Badge>
      </ListItemIcon>
      <ListItemText
        primary={<React.Fragment>
          <Typography
            component="span"
            variant="body1"
            className={classes.inline}
            color="textPrimary">
            <Badge><Avatar alt="r.category" className={classes.listIcon}>{r.category[0].toUpperCase() + ''}</Avatar></Badge>
            &nbsp;{r.description+r.description+r.description+r.description+r.description}
          </Typography>
        </React.Fragment>}
        secondary={<React.Fragment>
            {formatDistance(new Date(r.createdAt["_seconds"] * 1000), new Date(), { addSuffix: true })}
          &nbsp;&nbsp;
          <Typography component="span" variant="body2" color="textPrimary">
            <Link href={`mailto:${r.from}`} color="inherit">{`${r.from}`}</Link>{`, ${r.city}`}
          </Typography>
          &nbsp;&nbsp;
          {r.assignedTo!==''?<React.Fragment>
            <br/>poc:&nbsp;<Link href={`mailto:${r.from}`} color="inherit">{r.assignedTo}</Link>
            </React.Fragment>:null}
        </React.Fragment>} />
      <ListItemText >
        <div className={classes.itemactions}>
          <Tooltip title="Assign POC">
            <IconButton edge="end" aria-label="assign" onClick={() => { setCurrentReq(r);} }>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reply">
            <IconButton edge="end" aria-label="reply" onClick={() => { setCurrentReq(r); setNewReplyDialog(true); } }>
              <ReplyIcon />
            </IconButton>
          </Tooltip>
        </div>
      </ListItemText>
    </ListItem>
    {r.showReplies?r.replies.map((rr) => {
      return <ListItem key={rr.id + 'r'} className={classes.replyList}>
          <ListItemIcon>
            <SubdirectoryArrowRightIcon/>
          </ListItemIcon>
          <ListItemText
            primary={rr.description}
            secondary={<React.Fragment>
              {formatDistance(new Date(rr.createdAt["_seconds"] * 1000), new Date(), { addSuffix: true })}
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                &nbsp;&nbsp;{`${rr.from}`}
              </Typography>
            </React.Fragment>}
          />
        </ListItem>;
    }):null}
    <Divider inset/>
  </React.Fragment>;
}
