import React,{useState, useEffect} from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Button, Container, FormControl, FormControlLabel, Grid, InputAdornment, Paper, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
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
          <FilterControls/>
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

function AutocompletePhone({phonenumber, onChange}){
  const [value, setValue] = useState(phonenumber);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOnChange=(e,newValue)=>{
    setValue(newValue);
    console.log(newValue);
    if (onChange) {
      onChange(newValue);
    }
  }
  const handleInputChange = (_e, newInputValue)=>{
    setInputValue(newInputValue);
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

function FilterControls(){
  return (
    <Grid container spacing={1} alignItems='center'>
      <Grid item xs>
        <Grid item xs>
          <AutocompletePhone/>
        </Grid>
        <Grid item xs>
          <Button color='primary' variant="filled">Add</Button>
        </Grid>
      </Grid>
      <Grid item xs>
        <p>Filter options:</p>
      </Grid>
    </Grid>
  )
}