import React,{useState, useEffect} from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, Paper, Radio, RadioGroup, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import PhoneIcon from '@material-ui/icons/Phone';
import NumberFormat from 'react-number-format';

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
          <Paper className={classes.paper}><FilterControls defaultCategory={category}/></Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.paper}><PhoneList category={category}/></Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 


function NumberFormatPhone(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      format="+91 ##### #####"
      allowEmptyFormatting mask="_"
    />
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

function FilterControls({defaultCategory}){
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [phonenumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [desc, setDesc] = useState('');

  const handleAddDiaglogOpen = ()=>{
    setOpenAddDialog(true);
  }
  const handleAddDiaglogClose = ()=>{
    setOpenAddDialog(false);
  }

  const handlePhonenumberChange = (newvalue)=>{
    setPhoneNumber(newvalue);
  }

  const handleCategoryChange = (e)=>{
    setCategory(e.target.value);
  }

  const handleAddNewPhone = ()=>{

  }

  return (<React.Fragment>
    <Grid container spacing={1} alignItems='center'>
      <Grid item xs={1}>
        <Button color='primary' variant="filled" onClick={handleAddDiaglogOpen}>Add</Button>
      </Grid>
      <Grid item xs direction='row'>
        <Grid item xs>
          <AutocompletePhone onChange={handlePhonenumberChange}/>
        </Grid>
      </Grid>
      {/* <Grid item xs>
        <p>Filter options:</p>
      </Grid> */}
    </Grid>
    <Dialog open={openAddDialog} onClose={handleAddDiaglogClose} aria-labelledby="form-phonedialog-title">
      <form onSubmit={handleAddNewPhone}>
        <DialogTitle id="form-phonedialog-title">Add a new request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you have new phonenumber for covid resources? Please, add here!
          </DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField label="Phone" type='phone' margin="normal" variant="outlined" 
                  value={phonenumber}
                  onChange={handlePhonenumberChange}
                  InputProps={{
                    inputComponent: NumberFormatPhone,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}/>
            </Grid>
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
            <Grid item xs={12}>
              <TextField
                id="desc"
                label="Desc"
                multiline
                rows={4}
                placeholder="Additional info ."
                variant="outlined" 
                fullWidth
                value={desc}
                onChange={(event) => setDesc(event.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDiaglogClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    </React.Fragment>
  )
}

function PhoneList(){
  return (
    <Grid>
      <Grid item xs>list</Grid>
    </Grid>
  );
}