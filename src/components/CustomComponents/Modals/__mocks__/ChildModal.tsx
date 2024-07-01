import { Box } from "@mui/material";
import React from "react";
import { ChildModalProps } from "../ChildModal";

const ChildModal: React.FC<ChildModalProps> = ({
  children,
  open,
  sx,
  handleClose,
}) => {
  return (
    open && (
      <div data-testid="modal-child-overlay-test">
        <Box sx={{ ...sx }}>{children}</Box>
        <button onClick={handleClose}>close modal</button>
      </div>
    )
  );
};

export default ChildModal;
