import React,{useState, useEffect} from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, Paper, Radio, RadioGroup, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import PhonenumberField,{NumberFormatPhone} from '../../components/phonenumberfield';
import AddPhoneDialog from './AddPhoneDialog';
import axios from 'axios';
import PhoneGrid from './PhoneGrid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  }
}));


export default function PhoneInfo({category='  ', city}){
  const classes = useStyles();
  const [items, setItems] = useState([]);

  useEffect(()=>{

  }, [city, category]);

  return (
    <Container className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={2}
      >
        <Grid item xs>
          <Paper className={classes.paper}>{category[0].toUpperCase()+category.substr(1)}</Paper>
        </Grid>

        <Grid item xs>
          <Paper className={classes.paper}><FilterControls defaultCategory={category} defaultCity={city}/></Paper>
        </Grid>
        <Grid item xs>
          <PhoneGrid category={category} city={city}/>
        </Grid>
      </Grid>
    </Container>
  );
} 



function AutocompletePhone({phonenumber, onSelect, onChange}){
  const [value, setValue] = useState(phonenumber);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOnChange=(e,newValue)=>{
    setValue(newValue);
    console.log(newValue);
  }
  const handleInputChange = (_e, newInputValue)=>{
    setInputValue(newInputValue);
    console.log(newInputValue);
    if (onChange) {
      onChange(newInputValue);
    }
  }

  return (
    <Autocomplete 
      freeSolo
      options={options}
      value={value}
      onChange={handleOnChange}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField {...params} label="Phone" type='phone' margin="normal" variant="outlined" 
          InputProps={{
            inputComponent: NumberFormatPhone,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}/>
      )}
      />
  )
}

function FilterControls({defaultCategory, defaultCity}){
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [phonenumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);

  const handleAddDiaglogOpen = ()=>setOpenAddDialog(true);
  
  const handleAddDiaglogClose = ()=>setOpenAddDialog(false);

  const handlePhonenumberChange = (newvalue)=>setPhoneNumber(newvalue);


  const handleAddPhoneInfo = (data)=>{
    try {
      axios.post('/api/phone/', data)
        .then(_res=>{
          setError(null);
          setOpenAddDialog(false);
        })
        .catch(err=>{
          console.dir(err);
          if (err.response.status===400) {
            setError(err.response.data.error);
          }
        })
    } catch(ex) {
      console.error(ex);
    }
  }
  return (<React.Fragment>
    <Grid container spacing={1} alignItems='center'>
      <Grid item xs={1}>
        <Button color='primary' variant="contained" onClick={handleAddDiaglogOpen}>Add</Button>
      </Grid>
      <Grid item xs={6}>
        <AutocompletePhone onChange={handlePhonenumberChange}/>
      </Grid>
      {/* <Grid item xs>
        <p>Filter options:</p>
      </Grid> */}
    </Grid>
    <AddPhoneDialog open={openAddDialog} onClose={handleAddDiaglogClose} 
      onSubmit={handleAddPhoneInfo} error={error}
      data={{phonenumber, category:defaultCategory, city:defaultCity}}/>
    </React.Fragment>
  )
}