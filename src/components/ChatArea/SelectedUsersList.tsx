import React from "react";
import { UserModel } from "../../models/UserModel";
import { Stack } from "@mui/material";
import SelectedUser from "./SelectedUser";

interface SelectedUsersListProps {
  users: UserModel[];
  setSelectedUsers: (user: UserModel) => void;
}

const SelectedUsersList: React.FC<SelectedUsersListProps> = ({
  users,
  setSelectedUsers,
}) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      overflow={"auto"}
      sx={{ boxSizing: "border-box" }}
    >
      {users.map((user) => (
        <SelectedUser onDelete={setSelectedUsers} user={user} />
      ))}
    </Stack>
  );
};

export default SelectedUsersList;
