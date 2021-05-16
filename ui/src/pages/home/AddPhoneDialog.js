import React,{useState, useEffect} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Button, Checkbox, Container, Divider, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, MenuItem, Radio, RadioGroup, TextField } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import PhonenumberField,{NumberFormatPhone} from '../../components/phonenumberfield';
import CityDropdown from '../../components/citydropdown';
import Alert from '@material-ui/lab/Alert';

export default function AddPhoneDialog({open, data, onClose, onSubmit, error}){
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [phonenumber, setPhonenumber] = useState('');
  const [vstatus, setVStatus] = useState('notverified');
  const [category, setCategory] = useState('info');
  const [description, setDescription] = useState('');
  const [contactname, setContactName] = useState('');
  const [vtime, setVTime] = useState();
  const [city, setCity] = useState();

  useEffect(()=>{setOpenDialog(open);}, [open]);
  useEffect(()=>{
    let d=data||{};
    setPhonenumber(d.phonenumber);
    setVStatus(d.vstatus||'notverified');
    setCategory(d.category||'info');
    setDescription(d.description||'');
    setContactName(d.contactname||'');
    setCity(d.city);
    setVTime(d.vtime);
  }, [data]);

  const handlePhonenumberChange = (e)=>setPhonenumber(e.target.value);
  const handleContactNameChange = (e)=>setContactName(e.target.value);
  const handleVStatusChange = (e) => setVStatus(e.target.value);
  const handleCategoryChange = (e)=>setCategory(e.target.value);
  const handleDescChange = (e) => setDescription(e.target.value);
  const handleVTimeChange = (t) => setVTime(t);

  const handleDiaglogClose=()=>{
    setOpenDialog(false);
    if (onClose) onClose();
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        phonenumber, contactname, category,
        description, vstatus, vtime
      })
    }
  }
  return (
    <Dialog fullScreen={fullScreen} open={openDialog} onClose={handleDiaglogClose} 
      aria-labelledby="form-phonedialog-title">
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-phonedialog-title">Add a new phone number</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you have new phonenumber for covid resources? Please, add here!
          </DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {error?<Alert severity="error">{error}</Alert>:null}
            </Grid>
            <Grid item xs={6}>
              <PhonenumberField label="Phone" fullWidth variant="outlined" 
                value={phonenumber}
                onChange={handlePhonenumberChange}
                />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label='Contact Person'
                variant='outlined' value={contactname} onChange={handleContactNameChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth value={vstatus} onChange={handleVStatusChange}
                  label='Verification Status' helperText=' '>
                  <MenuItem value='notverified' key='notverified'>Not Verified</MenuItem>
                  <MenuItem value='verified' key='verified'>Verified</MenuItem>
                  <MenuItem value='invalid' key='invalid'>Invalid</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={6}>
            {vstatus==='verified'?<DateTimePicker autoOk ampm={false} fullWidth
                  label='Verified Time' helperText=''
                  inputVariant='standard' showTodayButton
                  value={vtime} onChange={handleVTimeChange}/>:null}
            </Grid>
            <Grid item cs={12}>
              <CityDropdown cityValue={city} onChange={c=>{setCity(c);}} width='70ch'/>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Category</FormLabel>
                <RadioGroup row aria-label="category" name="category" value={category} onChange={handleCategoryChange}>
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
                value={description}
                onChange={handleDescChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiaglogClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
    );
  }