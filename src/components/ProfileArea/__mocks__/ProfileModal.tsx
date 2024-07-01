import React, { useState } from "react";
import { Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { UserModel } from "../../../models/UserModel";
import { RootState } from "../../../utils/reduxStore";
import CustomModal from "../../CustomComponents/Modals/CustomModal";
import { UserProfileModalProps } from "../ProfileModal";

jest.mock("../../CustomComponents/Modals/CustomModal");

const UserProfileModal: React.FC<UserProfileModalProps<UserModel | null>> = ({
  profile,
  btnText,
  sx,
  isBtn,
  CustomBtn,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      {isBtn ? (
        <Button onClick={handleOpen} sx={{ p: 1, ...sx }}>
          {btnText}
        </Button>
      ) : (
        <Typography onClick={handleOpen} sx={sx}>
          {btnText}
        </Typography>
      )}
      {!!CustomBtn && <span onClick={handleOpen}>{CustomBtn}</span>}
      <CustomModal handleClose={handleClose} open={open}>
        <span>{profile?.name}</span>
      </CustomModal>
    </>
  );
};

const GroupProfileModal: React.FC<UserProfileModalProps<null>> = ({
  btnText,
  sx,
}) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const userId = user?._id;
  const adminId = selectedChat?.groupAdmin?._id;
  const isUserAdmin = adminId === userId;

  return (
    <>
      <Button onClick={handleOpen} sx={{ p: 1, ...sx }}>
        {btnText}
      </Button>

      {selectedChat && (
        <CustomModal handleClose={handleClose} open={open}>
          <span>{selectedChat.chatName}</span>
          {isUserAdmin ? <span>admin access</span> : <span>user access</span>}
        </CustomModal>
      )}
    </>
  );
};

const ProfileModal = {
  User: UserProfileModal,
  Group: GroupProfileModal,
};

export default ProfileModal;
