import { SxProps, Modal, Box, Theme } from "@mui/material";
import React, { ReactNode } from "react";

interface CustomModalProps {
  // openBtn: ReactNode;
  open: boolean;
  children: ReactNode;
  sx?: SxProps<Theme>;
  handleClose(): void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  sx,
  open,
  children,
  handleClose,
}) => {
  const modalStyle: SxProps<Theme> = {
    position: "absolute",
    top: "5vh",
    left: "50%",
    transform: "translateX(-50%)",
    minWidth: 250,
    maxWidth: 400,
    width: "100%",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    pt: 1,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle, ...sx }}>{children}</Box>
    </Modal>
  );
};

export default CustomModal;
