import { SxProps, Modal, Box, Theme } from "@mui/material";
import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";

interface CustomModalProps {
  openBtn: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
  innerModalSx?: SxProps<Theme>;
}

type ModalChildProps = {
  handleClose?: () => void;
};

const CustomModal: React.FC<CustomModalProps> = ({
  sx,
  openBtn,
  children,
  innerModalSx,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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

  const ChildrenWithProps = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement<ModalChildProps>(
      child as ReactElement<ModalChildProps>,
      { handleClose }
    );
  });

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
          <Box sx={innerModalSx}>{ChildrenWithProps}</Box>
        </Box>
      </Modal>
    </>
  );
};

export default CustomModal;
