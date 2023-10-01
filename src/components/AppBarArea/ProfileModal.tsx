import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import { Modal, Box, Typography, SxProps, Theme, Avatar } from "@mui/material";

type ProfileModalProps = {
  sx?: SxProps<Theme>;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ sx }) => {
  const user = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const innerModalStyle: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  };
  const modalStyle: SxProps<Theme> = {
    ...innerModalStyle,
    alignItems: "left",
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Typography onClick={handleOpen} sx={{ width: "100%", ...sx }}>
        My profile
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Box sx={innerModalStyle}>
            <Typography variant="h4" component="h2">
              {user?.name}
            </Typography>
            <Avatar
              sx={{ width: 150, height: 150 }}
              src={user?.image as string}
            />
          </Box>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Email: {user?.email}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;
