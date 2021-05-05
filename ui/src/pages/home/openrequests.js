import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import CityDropdown from "../../components/citydropdown";
import { useAuth } from "../../useauth";

export default function OpenRequests({city}) {
  const auth = useAuth();
  const [from, setFrom] = useState(auth.user.email);
  const [openNewDialog, setOpenNewDialog] = useState(false);

  const [rcity, setrcity] = useState(city);

  const handleNewDiaglogClose = ()=>{
    setOpenNewDialog(false);
  }

  const handleSubmitNewRequest=(e)=>{
    e.preventDefault();
    setOpenNewDialog(false);
  }

  return <div>
    <Typography variant='title'>Open Requests {city?'in ':null} {city?city.city:null} &nbsp;</Typography>
    <Button variant="contained" color="primary" onClick={()=>setOpenNewDialog(true)}>
      Add new Request
    </Button>

    <Dialog open={openNewDialog} onClose={handleNewDiaglogClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmitNewRequest}>
          <DialogTitle id="form-dialog-title">Add a new request</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you have a request for help from our volunteers? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="from"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              label="from"
              type="email"
            />
            <CityDropdown city={rcity} onChange={(c)=>setrcity(c)}/>
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
          
  </div>
}