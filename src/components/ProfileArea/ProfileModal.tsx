import React from "react";
import { Typography, Avatar, Button, Theme, SxProps } from "@mui/material";
import { UserModel } from "../../models/UserModel";
import CustomModal from "../CustomComponents/Modals/CustomModal";
import { ChatModel } from "../../models/ChatModel";
import ModalChildWithHandleClose from "./ModalChildWithHandleClose";

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
  const Btn = (
    <>
      {isBtn ? (
        <Button sx={{ p: 1, ...sx }}>{btnText}</Button>
      ) : (
        <Typography sx={sx}>{btnText}</Typography>
      )}
    </>
  );

  return (
    <CustomModal openBtn={Btn}>
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
  btnText,
  sx,
}) => {
  const Btn = <Button sx={{ p: 1, ...sx }}>{btnText}</Button>;

  return (
    <CustomModal
      openBtn={Btn}
      innerModalSx={{
        rowGap: 1,
        py: 1,
        width: "90%",
        margin: "auto",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ModalChildWithHandleClose chat={profile} />
    </CustomModal>
  );
};

const ProfileModal = {
  User: UserProfileModal,
  Group: GroupProfileModal,
};

export default ProfileModal;
