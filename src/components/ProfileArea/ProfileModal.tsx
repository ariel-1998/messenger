import React, { useState } from "react";
import {
  Typography,
  Avatar,
  Button,
  Theme,
  SxProps,
  Stack,
  Divider,
} from "@mui/material";
import { UserModel } from "../../models/UserModel";
import CustomModal from "../CustomComponents/Modals/CustomModal";
import { ChatModel } from "../../models/ChatModel";
import GroupForm from "../ChatArea/GroupForms/Forms/GroupForm";
import { RootState } from "../../utils/reduxStore";
import { useSelector } from "react-redux";

type UserProfileModalProps<T> = {
  profile?: T;
  btnText: string;
  sx?: SxProps<Theme>;
  isBtn?: boolean;
};

const UserProfileModal: React.FC<UserProfileModalProps<UserModel | null>> = ({
  profile,
  btnText,
  isBtn = false,
  sx,
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
      <CustomModal open={open} handleClose={handleClose}>
        <Typography variant="h4" component="h2">
          {profile?.name}
        </Typography>
        <Avatar
          sx={{ width: 150, height: 150 }}
          src={profile?.image as string}
        />
        <Typography variant="h5" sx={{ mt: 2 }}>
          Email: {profile?.email}
        </Typography>
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
  const adminId = selectedChat?.groupAdmin._id;
  const isUserAdmin = adminId === userId;

  return (
    <>
      <Button onClick={handleOpen} sx={{ p: 1, ...sx }}>
        {btnText}
      </Button>
      {selectedChat && (
        <CustomModal open={open} handleClose={handleClose}>
          <Stack
            sx={{
              rowGap: 1,
              py: 1,
              width: "90%",
              margin: "auto",
              boxSizing: "border-box",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography align="center" variant="h6" p={0} m={0}>
              Profile
            </Typography>
            <Divider />

            <Typography variant="h4" component="h2">
              {selectedChat?.chatName}
            </Typography>
            {/* <Avatar sx={{ width: 150, height: 150 }} src={group?.image as string} /> */}
            <GroupForm.RemoveMember />
            <GroupForm.Rename
              handleModalClose={handleClose}
              groupName={selectedChat?.chatName}
              groupId={selectedChat?._id}
            />
            {isUserAdmin && (
              <>
                <GroupForm.AddMembers handleParentModalClose={handleClose} />
                <GroupForm.Remove handleModalClose={handleClose} />
              </>
            )}
          </Stack>
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
