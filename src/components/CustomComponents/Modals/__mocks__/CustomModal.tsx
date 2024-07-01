import { Box } from "@mui/material";
import React from "react";
import { CustomModalProps } from "../CustomModal";

const CustomModal: React.FC<CustomModalProps> = ({
  sx,
  open,
  children,
  handleClose,
  className,
}) => {
  return (
    open && (
      <div data-testid="modal-overlay-test">
        <Box sx={{ ...sx }} className={className}>
          {children}
        </Box>
        <button onClick={handleClose}>close modal</button>
      </div>
    )
  );
};

export default CustomModal;
