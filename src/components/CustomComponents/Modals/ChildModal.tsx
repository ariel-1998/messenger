import {
  useMediaQuery,
  Modal,
  Box,
  useTheme,
  SxProps,
  Theme,
} from "@mui/material";
import React, { ReactNode } from "react";
import CustomModal from "./CustomModal";

interface ChildModalProps {
  children: ReactNode;
  open: boolean;
  handleClose(): void;
  sx?: SxProps<Theme>;
}

const ChildModal: React.FC<ChildModalProps> = ({
  children,
  open,
  sx,
  handleClose,
}) => {
  const theme = useTheme();
  const size = useMediaQuery(theme.breakpoints.down("xs"));

  const style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: size ? "90vw" : 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  return (
    <CustomModal open={open} sx={{ ...style, ...sx }} handleClose={handleClose}>
      {children}
    </CustomModal>
  );
};

export default ChildModal;
