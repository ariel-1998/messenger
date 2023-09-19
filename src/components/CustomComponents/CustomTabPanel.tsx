import { Box, Typography } from "@mui/material";
import React from "react";

interface CustomTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel: React.FC<CustomTabPanelProps> = ({
  index,
  value,
  children,
}) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
};

export default CustomTabPanel;
