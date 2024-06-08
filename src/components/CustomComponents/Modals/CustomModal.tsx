import {
  SxProps,
  Modal,
  Box,
  Theme,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { ReactNode } from "react";

interface CustomModalProps {
  open: boolean;
  children: ReactNode;
  sx?: SxProps<Theme>;
  handleClose(): void;
  className?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  sx,
  open,
  children,
  handleClose,
  className,
}) => {
  const theme = useTheme();
  const size = useMediaQuery(theme.breakpoints.down("sm"));
  const modalStyle: SxProps<Theme> = {
    position: "absolute",
    top: "5vh",
    left: "50%",
    transform: "translateX(-50%)",
    width: size ? "80vw" : 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    maxHeight: "83vh",
    minHeight: 300,
    backgroundColor: "#E5E5E5",
    overflowY: "auto",
    boxShadow: 24,
    p: 3,
  };

  return (
    <Modal open={open} onClose={handleClose} data-testid="modal-overlay-test">
      <Box sx={{ ...modalStyle, ...sx }} className={className}>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
