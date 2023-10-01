import { Box, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

import React, { forwardRef } from "react";

type CustomSearchInputProps = {
  boxClick?: () => void;
  iconClick?: () => void;
  inputCursor?: string;
  iconCursor?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const CustomSearchInput = forwardRef<HTMLInputElement, CustomSearchInputProps>(
  (
    {
      boxClick,
      iconClick,
      iconCursor = "pointer",
      inputCursor = "pointer",
      ...rest
    },
    ref
  ) => {
    return (
      <Box
        onClick={boxClick}
        style={{
          position: "relative",
          cursor: "pointer",
        }}
      >
        <IconButton
          onClick={iconClick}
          disableFocusRipple
          disableRipple
          sx={{ position: "absolute", left: "6%", cursor: iconCursor }}
        >
          <SearchIcon />
        </IconButton>
        <input
          {...rest}
          ref={ref}
          style={{
            cursor: inputCursor,
            border: "1px solid #ccc",
            borderRadius: 20,
            padding: "10px 20px",
            textIndent: "50px",
            fontSize: "1rem",
          }}
        />
      </Box>
    );
  }
);

export default CustomSearchInput;
