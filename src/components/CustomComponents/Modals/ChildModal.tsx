import {
  useMediaQuery,
  Modal,
  Box,
  Stack,
  useTheme,
  SxProps,
  Theme,
} from "@mui/material";
import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";

interface ChildModalProps {
  children: ReactNode;
  openBtn: ReactNode;
  sx?: SxProps<Theme>;
}

type ChildrenProps = {
  handleChildModalClose?(): void;
};

const ChildModal: React.FC<ChildModalProps> = ({ children, openBtn, sx }) => {
  const theme = useTheme();
  const size = useMediaQuery(theme.breakpoints.down("xs"));
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const ChildrenWithProps = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement<ChildrenProps>(child as ReactElement<ChildrenProps>, {
      handleChildModalClose: handleClose,
    });
  });

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
    <>
      <span onClick={handleOpen}>{openBtn}</span>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style, ...sx }}>
          <Stack width={"100%"}>{ChildrenWithProps}</Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ChildModal;
