import { Typography, useTheme } from "@mui/material";
import React, { ReactNode } from "react";

type CustomTypoProps = {
  children: ReactNode;
};

const CustomTypo: React.FC<CustomTypoProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <Typography
      sx={{
        color: theme.palette.primary.main,
      }}
    >
      {children}
    </Typography>
  );
};

export default CustomTypo;
