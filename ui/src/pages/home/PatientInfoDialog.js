
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React,{useState, useEffect} from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Button, Checkbox, Container, Divider, FormControlLabel, Grid, LinearProgress, MenuItem, TextField } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers'


export default function PaintInfoDialog({open, onClose, data, onChange}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isBusy, setBusy] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relation, setRelation] = useState('self');
  const [testResult, setTestResult] = useState('+ve');
  const [srfid, setsrfid] = useState('');
  const [bunumber, setbunumber] = useState('');
  const [address, setAddress] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [comorbidities, setComorbidities] = useState('');
  const [isOnO2, setIsOnO2] = useState(false);
  const [spo2, setSpo2] = useState('');
  const [typeOfBed, setTypeOfBed] = useState('none');
  const [bedSince, setBedSince] = useState();
  const [hospType, setHospType] = useState('any');
  const [hospname, setHospName] = useState('');
  const [dname, setDName] = useState('');
  const [aname, setAName] = useState('');
  const [aphonenumber, setAPhoneNumber] = useState(null);
  const [arelation, setARelation] = useState('self');
  const [remarks, setRemarks] = useState('');

  useEffect(()=>{
    setIsOpen(open);
  },[open]);

  useEffect(()=>{
    const d=data||{};
    setRelation(d.relation||'self');
    setName(d.name||'');
    setAge(d.age||'');
    setAddress(d.address||'');
    setSymptoms(d.symptoms||'');
    setComorbidities(d.comorbidities||'');
    setSpo2(d.spo2||'');
    setIsOnO2(d.isOnO2||false);
    setBedSince(d.bedSince);
    setTestResult(d.testResult||'+ve');
    setHospType(d.hospType||'any');
    setHospName(d.hospname||'');
    setTypeOfBed(d.typeOfBed||'none');
    setAName(d.aname||'');
    setAPhoneNumber(d.aphonenumber);
    setARelation(d.arelation||'self');
    setRemarks(d.remarks||'');
    setDName(d.dname||'');
    setsrfid(d.srfid||'');
    setbunumber(d.bunumber||'');
  },[data]);

  const handleClose =()=>{
    setIsOpen(false);
    if (onClose) onClose();
  }

  const handleAddPInfo = (e)=>{
    e.preventDefault();
    try {
      setBusy(true);
      if (onChange) {
        onChange({
          name, age, 
          relation, testResult, 
          srfid, bunumber,
          address,symptoms, comorbidities, 
          isOnO2, spo2,
          typeOfBed,bedSince,
          hospType, hospname, dname,
          aname, aphonenumber, arelation,
          remarks
        });
      }
      setTimeout(()=>{
        setBusy(false);
        handleClose();
      }, 2000)
    } catch (ex) {
      setBusy(false);
      console.error(ex);
    } 
  }

  const handleRelationChange = (e)=>setRelation(e.target.value);
  const handleNameChange = (e)=>setName(e.target.value);
  const handleAgeChange = (e)=>setAge(e.target.value);
  const handleTestresultChange = (e)=>setTestResult(e.target.value);
  const handleAddressChange = (e)=>setAddress(e.target.value);
  const handleSymptomsChange = (e)=>setSymptoms(e.target.value);
  const handleTypeofBedChange = (e)=>setTypeOfBed(e.target.value);
  const handleIsOnO2Change = (e)=>setIsOnO2(e.target.value);
  const handleSpo2Change = (e)=>setSpo2(e.target.value);
  const handleANameChange = (e)=>setAName(e.target.value);
  const handleANumberChange = (e)=>setAPhoneNumber(e.target.value);
  const handleARelationChange = (e)=>setARelation(e.target.value);
  const handleCoMChange = (e)=>setComorbidities(e.target.value);
  const handleHospTypeChange = (e)=>setHospType(e.target.value);
  const handleHospNameChange = (e)=>setHospName(e.target.value);
  const handleRemarksChange = (e)=>setRemarks(e.target.value);
  const handleDNameChange = (e)=>setDName(e.target.value);
  const handleSRFIDChange = (e)=>setsrfid(e.target.value);
  const handleBUNumberChange = (e)=>setbunumber(e.target.value);

  return (
    <Dialog aria-labelledby="form-pinfodialog-title"
      fullScreen={fullScreen} open={isOpen} scroll={scroll}>
      <form onSubmit={handleAddPInfo}>
        <DialogTitle id="form-pinfodialog-title">Patient Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you have more patient information for our volunteers? Please, add it!
          </DialogContentText>
          <Container>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField label='Name' helperText='Patient Name' required fullWidth
                value={name} onChange={handleNameChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField label='Age' helperText='Patient Age' required fullWidth
                value={age} onChange={handleAgeChange} type='number'/>
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth value={relation} onChange={handleRelationChange}
                label='Relation' helperText='Your relationship with the patient'>
                <MenuItem value='self' key='self'>Self</MenuItem>
                <MenuItem value='family' key='family'>Family</MenuItem>
                <MenuItem value='friend' key='friend'>Friend</MenuItem>
                <MenuItem value='other' key='other'>Other</MenuItem>
              </TextField>
            </Grid>
            {/* <Grid item xs={4}>
              <FormControlLabel  label={'Covid Test Done'} 
                control={
                  <Checkbox helperText='Is Covid Test Done?'
                      value={covidTestDone} onChange={handleCovidTest}/>
                }/>
            </Grid> */}
            <Grid item xs={6}>
              <TextField select fullWidth value={testResult} onChange={handleTestresultChange}
                label='RT-PCR' helperText='Covid Result'>
                <MenuItem value='+ve' key='+ve'>+ve</MenuItem>
                <MenuItem value='-ve' key='-ve'>-ve</MenuItem>
                <MenuItem value='awaiting' key='friend'>Awaiting Result</MenuItem>
                <MenuItem value='notdone' key='testnotdone'>Test not done</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField label='SRFID' helperText='' fullWidth
                value={srfid} onChange={handleSRFIDChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField label='BU Number' helperText='' fullWidth
                value={bunumber} onChange={handleBUNumberChange}/>
            </Grid>
            <Grid item xs={12}>
              <TextField multiline label='Address' helperText='Area / Location/Address' fullWidth
                value={address} onChange={handleAddressChange} variant='outlined' rows={4}/>
            </Grid>

            <Grid item xs={12}>
              <br/>
              <Divider variant="middle"/>
              <br/>
            </Grid>
            <Grid item xs={12}>
              <TextField multiline label='Symptoms' helperText='Patient symptoms' fullWidth
                value={symptoms} onChange={handleSymptomsChange} variant='outlined' rows={2}/>
            </Grid>
            <Grid item xs={12}>
              <TextField multiline label='Co-morbidities' helperText='Co-morbid conditions' fullWidth
                value={comorbidities} onChange={handleCoMChange} variant='outlined' rows={2}/>
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel label={'Is on O2'}
                control={
                  <Checkbox helperText='Is on Oxygen'
                      value={isOnO2} onChange={handleIsOnO2Change}/>
                }/>
            </Grid>
            <Grid item xs={6}>
              <TextField label='SpO2' helperText='SpO2 level' required fullWidth
                value={spo2} onChange={handleSpo2Change} type='number'/>
            </Grid>

            <Grid item xs={12}>
              <br/> <Divider variant="middle"/><br/>
            </Grid>

            <Grid item xs={6}>
              <TextField select fullWidth value={typeOfBed} onChange={handleTypeofBedChange}
                label='Type of Bed' helperText='Type of bed needed?'>
                <MenuItem value='none' key='none'>None</MenuItem>
                <MenuItem value='any' key='any'>Any</MenuItem>
                <MenuItem value='o2' key='o2'>Oxygen</MenuItem>
                <MenuItem value='ventilator' key='ventilator'>Ventilator</MenuItem>
                <MenuItem value='icu' key='icu'>ICU</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              {typeOfBed!=='none'?<DateTimePicker autoOk ampm={false} fullWidth
                  label='Bed needed from' helperText='Looking for bed since'
                  inputVariant='standard' showTodayButton
                  value={bedSince} onChange={(d)=>setBedSince(d)}/>:null}
            </Grid>
            <Grid item xs={6}>
              <TextField select fullWidth value={hospType} onChange={handleHospTypeChange}
                label='Hospital Preference' helperText='Hospital Preference'>
                <MenuItem value='any' key='any'>Any</MenuItem>
                <MenuItem value='pvt' key='pvt'>Pvt</MenuItem>
                <MenuItem value='govt' key='govt'>Govt</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField label='Hospital Name' helperText=' Hospital name, if already admitted' fullWidth
                value={hospname} onChange={handleHospNameChange}/>
            </Grid>
            <Grid item xs={12}>
              <TextField label='Doctor Name' required fullWidth variant='outlined'
                value={dname} onChange={handleDNameChange}/>
            </Grid>

            <Grid item xs={12}>
              <br/> <Divider variant="middle"/><br/>
            </Grid>

            <Grid item xs={4}>
              <TextField label='Attender Name' helperText='Attender Name' fullWidth
                value={aname} onChange={handleANameChange}/>
            </Grid>
            <Grid item xs={4}>
              <TextField label='Attender Number' helperText='Attender Phone Number' fullWidth
                value={aphonenumber} onChange={handleANumberChange} type='phone'/>
            </Grid>
            <Grid item xs={4}>
              <TextField select fullWidth value={arelation} onChange={handleARelationChange}
                label='Attender Relation' helperText='Attender relationship with the patient'>
                <MenuItem value='self' key='self'>Self</MenuItem>
                <MenuItem value='family' key='family'>Family</MenuItem>
                <MenuItem value='friend' key='friend'>Friend</MenuItem>
                <MenuItem value='other' key='other'>Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField multiline label='Other Remarks' helperText='' fullWidth
                value={remarks} onChange={handleRemarksChange} variant='outlined' rows={2}/>
            </Grid>
          </Grid>
          </Container>
          {isBusy ? <LinearProgress /> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddPInfo} color="primary" disabled={isBusy}>
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}