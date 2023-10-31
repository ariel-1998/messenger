import { useMediaQuery, useTheme, SxProps, Theme } from "@mui/material";
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
  const size = useMediaQuery(theme.breakpoints.down("sm"));

  const style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: size ? "85vw" : 450,
    bgcolor: "background.paper",
    boxShadow: 24,
    minHeight: 100,
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
