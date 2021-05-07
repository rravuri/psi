import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function UsersTextField({
    width='auto', onChange,
    ...otherProps}) {
  const classes = useStyles();
  const [value, setValue] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(()=>{
    if (inputValue.length<3) return;
    setLoading(true);
    axios.get(`/api/user/match?email=${inputValue}`)
      .then(res=>{
        setOptions(res.data);
        setLoading(false);
      })
      .catch(err=>{
        console.error(err);
        setLoading(false);
      })
  },[inputValue]);

  const handleInputChange = (_e, newInputValue)=>{
    console.log(newInputValue);
    setInputValue(newInputValue);
  }
  return (
    <div className={classes.root} style={{width}}>
      <Autocomplete
        {...otherProps}
        multiple freeSolo
        id="users-email-select"
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              size="small"
              {...getTagProps({ index })}
            />
          ))
        }
        loading={loading}
        value={value}
        onChange={(_e, newValue) => {
          setValue(newValue);
          if (onChange) {
            onChange(newValue);
          }
        }}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={options.map(u=>u.email)}
        renderInput={(params) => (
          <TextField {...params} label="Email" margin="normal" variant="outlined" />
        )}
      />
    </div>
  );
}
