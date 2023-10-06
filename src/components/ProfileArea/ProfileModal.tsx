import React, { ReactNode } from "react";
import { Modal, Box, Typography, SxProps, Theme, Avatar } from "@mui/material";
import { UserModel } from "../../models/UserModel";
import CustomModal from "../CustomComponents/CustomModal";

type ProfileModalProps = {
  user: UserModel | null;
  children: ReactNode;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ user, children }) => {
  return (
    <CustomModal openBtn={children}>
      <Typography variant="h4" component="h2">
        {user?.name}
      </Typography>
      <Avatar sx={{ width: 150, height: 150 }} src={user?.image as string} />
      <Typography variant="h5" sx={{ mt: 2 }}>
        Email: {user?.email}
      </Typography>
    </CustomModal>
  );
};

export default ProfileModal;
