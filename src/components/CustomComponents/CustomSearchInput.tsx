import { Box, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

import React, { forwardRef, ComponentProps } from "react";

export type CustomSearchInputProps = {
  disableRipple?: boolean;
  disableFocusRipple?: boolean;
  isIcon?: boolean;
  style?: React.CSSProperties;
} & ComponentProps<"input">;
// } & React.InputHTMLAttributes<HTMLInputElement>;

const CustomSearchInput = forwardRef<HTMLInputElement, CustomSearchInputProps>(
  (
    {
      isIcon = true,
      disableFocusRipple = false,
      disableRipple = false,
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <Box
        sx={{
          position: "relative",
          width: "auto",
        }}
      >
        {isIcon && (
          <IconButton
            disableFocusRipple={disableFocusRipple}
            disableRipple={disableRipple}
            sx={{ position: "absolute", left: "6%" }}
          >
            <SearchIcon />
          </IconButton>
        )}
        <input
          className="custom-input"
          ref={ref}
          style={{
            boxSizing: "border-box",
            textAlign: "center",
            textIndent: 0,
            ...style,
          }}
          {...rest}
        />
      </Box>
    );
  }
);

export default CustomSearchInput;
