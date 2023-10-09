import React, { ReactNode } from "react";
import { Typography, Avatar, Button, Divider, Stack } from "@mui/material";
import { UserModel } from "../../models/UserModel";
import CustomModal from "../CustomComponents/CustomModal";
import { ChatModel } from "../../models/ChatModel";
import RenameGroupChat from "../ChatArea/GroupForms/Forms/RenameGroupChat";

type UserProfileModalProps<T> = {
  profile: T | undefined;
  children: ReactNode;
};

const UserProfileModal: React.FC<UserProfileModalProps<UserModel | null>> = ({
  profile,
  children,
}) => {
  return (
    <CustomModal sx={{ alignItems: "center" }} openBtn={children}>
      <Typography variant="h4" component="h2">
        {profile?.name}
      </Typography>
      <Avatar sx={{ width: 150, height: 150 }} src={profile?.image as string} />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Email: {profile?.email}
      </Typography>
    </CustomModal>
  );
};

const GroupProfileModal: React.FC<UserProfileModalProps<ChatModel>> = ({
  profile,
  children,
}) => {
  return (
    <CustomModal sx={{ alignItems: "center" }} openBtn={children}>
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
        <RenameGroupChat
          groupName={profile?.chatName || ""}
          groupId={profile?._id || ""}
        />
        <Button>remove users from group</Button>
        <Button>add users to group</Button>
      </Stack>
    </CustomModal>
  );
};

const ProfileModal = {
  User: UserProfileModal,
  Group: GroupProfileModal,
};

export default ProfileModal;
