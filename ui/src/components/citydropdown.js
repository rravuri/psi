/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import {matchSorter} from 'match-sorter';

import cityList from './cities';

//const filterOptions = (options, { inputValue }) =>
//   matchSorter(options, inputValue);


const filterOptions = createFilterOptions({stringify:op=>op.city});

export default function CityDropdown({cityValue={city:'', state:''}, onChange, width='100%', variant="outlined", ...otherProps}) {
  const [value, setValue] = React.useState(cityList[4]);
  const [inputValue, setInputValue] = React.useState(value?value.city:'');
  const [open, toggleOpen] = React.useState(false);

  React.useEffect(()=>{
    let didx=-1;
    if (cityValue) {
      didx=cityList.findIndex(c=>c.city===cityValue.city);
    }
    if (didx===-1){
      setValue(cityList[4]);
    } else {
      setValue(cityList[didx]);
    }
  },[cityValue]);

  const handleClose = () => {
    setDialogValue({
      city: '',
      state: '',
    });

    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    city: '',
    state: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
      city: dialogValue.city,
      state: parseInt(dialogValue.state, 10),
    });

    handleClose();
  };

  return (
    <React.Fragment>
      <Autocomplete
        {...otherProps}
        value={value}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(_event, newValue) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                city: newValue,
                state: '',
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              city: newValue.inputValue,
              state: '',
            });
          } else {
            setValue(newValue);
            if (onChange) {
              onChange(newValue);
            }
          }
        }}
        filterOptions={filterOptions}
        id="city-dialog"
        options={cityList}
        getOptionLabel={(option) => option.city}
        style={{ width , maxWidth:'90vw'}}
        renderInput={(params) => <TextField fullWidth {...params} label="City" variant={variant} />}
        renderOption={(option) => (
          <React.Fragment>
            {option.city}
          </React.Fragment>
        )}
      />
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">Add a new city</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any city in our list? Please, add it!
              </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.city}
              onChange={(event) => setDialogValue({ ...dialogValue, city: event.target.value })}
              label="city"
              type="text"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.city}
              onChange={(event) => setDialogValue({ ...dialogValue, city: event.target.value })}
              label="city"
              type="text"
            />ix
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.state}
              onChange={(event) => setDialogValue({ ...dialogValue, state: event.target.value })}
              label="state"
              type="number"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

