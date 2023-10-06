import React, { ChangeEvent, ReactNode, useState } from "react";
import CustomModal from "../CustomComponents/CustomModal";
import {
  Divider,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Box,
} from "@mui/material";
import { userService } from "../../services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import useDebounce from "../../hooks/useDebounce";
import { UserModel } from "../../models/UserModel";
import { isUserInArr } from "../../utils/userMethods";
import SelectedUsersList from "./SelectedUsersList";
import UserList from "./UserList";
import { Add } from "@mui/icons-material";
import { chatService } from "../../services/chatService";
import { createGroupSchema } from "../../models/ChatModel";
import { ErrorModels, toastifyService } from "../../services/toastifyService";

interface CreateGroupChatProps {
  children: ReactNode;
}

const CreateGroupChat: React.FC<CreateGroupChatProps> = ({ children }) => {
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const { debounce: debouncedOnInput, isLoading } = useDebounce({
    fn: onInput,
    wait: 1500,
  });

  const { data: usersData } = useQuery({
    queryKey: ["search", userSearch],
    queryFn: () => userService.searchUsers(userSearch),
    enabled: !!userSearch,
  });

  const groupMutation = useMutation({
    mutationFn: chatService.createGroupChat,
    onSuccess: () => {
      console.log("Successfully created");
    },
    onError: (err: ErrorModels) => toastifyService.error(err),
  });

  const createGroup = () => {
    //   try {
    //     createGroupSchema.parse(selectedUsers);
    //     groupMutation.mutate({
    //       users: selectedUsers,
    //       chatName: chatName
    //     })
    //   } catch (error) {
    //     console.log(err)
    //   }
  };

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    setUserSearch(e.target.value);
  }

  const onUserClick = (user: UserModel) => {
    const index = isUserInArr(selectedUsers, user);
    if (index === -1) return setSelectedUsers([...selectedUsers, user]);
    onDeleteUser(user);
  };

  const onDeleteUser = (user: UserModel) => {
    const filteredUsers = selectedUsers.filter(
      (arrUser) => arrUser._id !== user._id
    );
    setSelectedUsers(filteredUsers);
  };

  return (
    <CustomModal openBtn={children} sx={{ top: "10%", pb: 4 }}>
      <Typography align="center" variant="h6" p={0} m={0}>
        CREATE NEW GROUP
      </Typography>
      <Divider />
      <Stack
        spacing={1}
        py={1}
        direction={"row"}
        width={"80%"}
        margin={"auto"}
        boxSizing={"border-box"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <FormControl variant="outlined">
          <InputLabel size={"small"}>Search Users...</InputLabel>
          <OutlinedInput
            onInput={debouncedOnInput}
            type={"text"}
            size="small"
            fullWidth
            endAdornment={<>{isLoading && <Box width={"10px"}>loading</Box>}</>}
            label="Search Users..."
          />
        </FormControl>
        <Stack>
          <IconButton
            sx={{
              p: 1,
              borderRadius: "10px",
              ":hover": { bgcolor: "#f3e5f555" },
            }}
            onClick={createGroup}
            edge="end"
          >
            <Add />
          </IconButton>
        </Stack>
      </Stack>
      <SelectedUsersList
        users={selectedUsers}
        setSelectedUsers={onDeleteUser}
      />
      {usersData && (
        <UserList
          users={usersData}
          selectedUsers={selectedUsers}
          onUserClick={onUserClick}
        />
      )}
    </CustomModal>
  );
};

const GroupForm = {
  Create: CreateGroupChat,
};
export default GroupForm;
