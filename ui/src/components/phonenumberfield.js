import React from 'react';

import { InputAdornment, TextField } from "@material-ui/core";
import NumberFormat from "react-number-format";
import PhoneIcon from '@material-ui/icons/Phone';

export function NumberFormatPhone(props) {
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

export default function PhonenumberField({ ...otherProps}) {
  return (
    <TextField {...otherProps}
      type='phone'
      InputProps={{
        inputComponent: NumberFormatPhone,
        startAdornment: (
          <InputAdornment position="start">
            <PhoneIcon />
          </InputAdornment>
        ),
      }}/>
  )
}