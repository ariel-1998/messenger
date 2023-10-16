import React, { ReactNode } from "react";
import {
  Typography,
  Avatar,
  Button,
  Divider,
  Stack,
  Theme,
  SxProps,
} from "@mui/material";
import { UserModel } from "../../models/UserModel";
import CustomModal from "../CustomComponents/CustomModal";
import { ChatModel } from "../../models/ChatModel";
import RenameGroupChat from "../ChatArea/GroupForms/Forms/RenameGroupChat";
import GroupForm from "../ChatArea/GroupForms/Forms/GroupForm";
import { useModal } from "../Context/ModalProvider";

type UserProfileModalProps<T> = {
  profile: T;
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
  const { openModal } = useModal();
  const modalContent = (
    <>
      <Typography variant="h4" component="h2">
        {profile?.name}
      </Typography>
      <Avatar sx={{ width: 150, height: 150 }} src={profile?.image as string} />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Email: {profile?.email}
      </Typography>
    </>
  );
  return (
    <>
      {isBtn ? (
        <Button onClick={() => openModal(modalContent)} sx={{ p: 1, ...sx }}>
          {btnText}
        </Button>
      ) : (
        <Typography onClick={() => openModal(modalContent)} sx={sx}>
          {btnText}
        </Typography>
      )}
    </>
  );
};

const GroupProfileModal: React.FC<UserProfileModalProps<ChatModel>> = ({
  profile,
  btnText,
  sx,
}) => {
  const { openModal } = useModal();
  const modalContent = (
    <>
      <Typography align="center" variant="h6" p={0} m={0}>
        Profile
      </Typography>
      <Divider />
      <Stack
        spacing={1}
        py={1}
        width={"90%"}
        margin={"auto"}
        boxSizing={"border-box"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography variant="h4" component="h2">
          {profile?.chatName}
        </Typography>
        {/* <Avatar sx={{ width: 150, height: 150 }} src={group?.image as string} /> */}
        <GroupForm.Rename
          groupName={profile?.chatName}
          groupId={profile?._id}
        />
        <GroupForm.AddMembers />
        <Button>remove users from group</Button>
      </Stack>
    </>
  );
  return (
    <Button sx={{ p: 1, ...sx }} onClick={() => openModal(modalContent)}>
      {btnText}
    </Button>
  );
};

const ProfileModal = {
  User: UserProfileModal,
  Group: GroupProfileModal,
};

export default ProfileModal;
