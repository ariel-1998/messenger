import { Box, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

import React, { forwardRef } from "react";

type CustomSearchInputProps = {
  boxClick?: () => void;
  iconClick?: () => void;
  inputCursor?: string;
  iconCursor?: string;
  disableRipple?: boolean;
  disableFocusRipple?: boolean;
  isIcon?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const CustomSearchInput = forwardRef<HTMLInputElement, CustomSearchInputProps>(
  (
    {
      boxClick,
      iconClick,
      isIcon = true,
      iconCursor = "pointer",
      inputCursor = "pointer",
      disableFocusRipple = false,
      disableRipple = false,
      ...rest
    },
    ref
  ) => {
    return (
      <Box
        onClick={boxClick}
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          width: "fit-content",
        }}
      >
        {isIcon && (
          <IconButton
            onClick={iconClick}
            disableFocusRipple={disableFocusRipple}
            disableRipple={disableRipple}
            sx={{ position: "absolute", left: "6%", cursor: iconCursor }}
          >
            <SearchIcon />
          </IconButton>
        )}
        <input
          className="custom-input"
          ref={ref}
          style={{
            cursor: inputCursor,
            textAlign: "center",
            textIndent: 0,
          }}
          {...rest}
        />
      </Box>
    );
  }
);

export default CustomSearchInput;
