import React from "react";
import { UserModel } from "../../../models/UserModel";
import { Box, Stack, Typography } from "@mui/material";
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
      width={"100%"}
      spacing={1}
      overflow={"auto"}
      textAlign={"center"}
      sx={{ boxSizing: "border-box", height: 30 }}
    >
      {!users.length ? (
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Typography>Select users</Typography>
        </Box>
      ) : (
        users.map((user) => (
          <SelectedUser
            key={user._id}
            onDelete={setSelectedUsers}
            user={user}
          />
        ))
      )}
    </Stack>
  );
};

export default SelectedUsersList;
