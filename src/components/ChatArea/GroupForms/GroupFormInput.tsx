import {
  FormControl,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import React, { forwardRef } from "react";

type GroupFormInputProps = {
  label: string;
} & OutlinedInputProps;

const GroupFormInput: React.FC<GroupFormInputProps> = forwardRef(
  ({ label, ...rest }, ref) => {
    return (
      <FormControl sx={{ m: 5 }} fullWidth variant="outlined">
        <InputLabel size={"small"}>{label}</InputLabel>
        <OutlinedInput
          type={"text"}
          size="small"
          label={label}
          ref={ref}
          {...rest}
        />
      </FormControl>
    );
  }
);

export default GroupFormInput;
