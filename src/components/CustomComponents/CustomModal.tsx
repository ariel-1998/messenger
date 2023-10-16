import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from "react";
import { Modal, Box, SxProps, Theme } from "@mui/material";
import { useModal } from "../Context/ModalProvider";

interface CustomModalProps {
  openBtn: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const CustomModal: React.FC<CustomModalProps> = ({ sx }) => {
  const { isOpen, closeModal, modalContent } = useModal();

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

  // const ChildrenWithProps = Children.map(children, (child) => {
  //   if (!isValidElement(child)) return child;
  //   return cloneElement<ModalChildProps>(
  //     child as ReactElement<ModalChildProps>,
  //     { handleClose }
  //   );
  // });

  return (
    <>
      <Modal
        open={isOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...modalStyle, ...sx }}>
          <Box sx={{ ...innerModalStyle }}></Box>
          {modalContent}
        </Box>
      </Modal>
    </>
  );
};

export default CustomModal;
