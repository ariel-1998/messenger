import React, { ReactNode } from "react";
import { Modal, Box, Typography, SxProps, Theme, Avatar } from "@mui/material";

interface CustomModalProps {
  openBtn: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const CustomModal: React.FC<CustomModalProps> = ({ openBtn, sx, children }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const innerModalStyle: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  };
  const modalStyle: SxProps<Theme> = {
    ...innerModalStyle,
    alignItems: "left",
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    pt: 1,
  };
  return (
    <>
      <span onClick={handleOpen}>{openBtn}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...modalStyle, ...sx }}>
          <Box sx={{ ...innerModalStyle }}></Box>
          {children}
        </Box>
      </Modal>
    </>
  );
};

export default CustomModal;
