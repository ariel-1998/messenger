import React from "react";
import { UserModel } from "../../models/UserModel";
import { Chip } from "@mui/material";

interface SelectedUserProps {
  user: UserModel;
  onDelete: (user: UserModel) => void;
}

const SelectedUser: React.FC<SelectedUserProps> = ({ user, onDelete }) => {
  return (
    <Chip
      label={user?.name}
      variant="outlined"
      onDelete={() => onDelete(user)}
    />
  );
};

export default SelectedUser;
