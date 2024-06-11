import { Box } from "@mui/material";
import React from "react";

export interface CustomTabPanelProps {
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
    <div data-testid="tab" hidden={value !== index}>
      {value === index && (
        <Box data-testid="chilren-wrapper" sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default CustomTabPanel;
