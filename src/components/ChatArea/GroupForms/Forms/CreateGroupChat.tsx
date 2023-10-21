import React, { ChangeEvent, useState } from "react";
import { Divider, Stack, Typography, Box, Button } from "@mui/material";
import { userService } from "../../../../services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import useDebounce from "../../../../hooks/useDebounce";
import { UserModel } from "../../../../models/UserModel";
import { isUserInArr } from "../../../../utils/userMethods";
import SelectedUsersList from "../SelectedUsersList";
import UserList from "../UserList";
import { chatService } from "../../../../services/chatService";
import { createGroupSchema } from "../../../../models/ChatModel";
import {
  ErrorModels,
  toastifyService,
} from "../../../../services/toastifyService";
import GroupFormInput from "../GroupFormInput";
import { extractZodErrors } from "../../../../utils/zodMetods";
import { ZodError } from "zod";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";
import CustomModal from "../../../CustomComponents/Modals/CustomModal";

const CreateGroupChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(false);
  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          p: 0,
          fontSize: "1.1rem",
          fontWeight: 400,
          lineHeight: 1.5,
          color: "#f50057",
        }}
        endIcon={<Add />}
      >
        new group
      </Button>
      <CustomModal
        open={open}
        handleClose={handleClose}
        sx={{ top: "5vh", pb: 3 }}
      >
        <CreateGroupChatContent handleClose={handleClose} />
      </CustomModal>
    </>
  );
};

export default CreateGroupChat;

interface CreateGroupChatContentProps {
  handleClose: () => void;
}

function CreateGroupChatContent({
  handleClose,
}: CreateGroupChatContentProps): JSX.Element {
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const { debounce: debouncedOnInput, isLoading } = useDebounce({
    fn: onInput,
    wait: 1500,
  });
  const handleModalClose = handleClose || (() => undefined);

  const { data: usersData, isError } = useQuery({
    queryKey: ["search", userSearch],
    queryFn: () => userService.searchUsers(userSearch),
    enabled: !!userSearch,
  });

  const groupMutation = useMutation({
    mutationFn: chatService.createGroupChat,
    onError: (err: ErrorModels) => toastifyService.error(err),
    onSuccess: handleModalClose,
  });

  const createGroup = () => {
    try {
      createGroupSchema.parse({ chatName: groupName, users: selectedUsers });
      groupMutation.mutate({
        users: selectedUsers,
        chatName: groupName,
      });
    } catch (error) {
      extractZodErrors(error as ZodError);
    }
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
    <>
      <Typography align="center" variant="h6" p={0} m={0}>
        CREATE NEW GROUP
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
        <GroupFormInput
          defaultValue={groupName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setGroupName(e.currentTarget.value)
          }
          label={"Group name"}
        />
        <GroupFormInput
          sx={{ boxSizing: "border-box" }}
          label={"Search Users..."}
          onInput={debouncedOnInput}
          endAdornment={isLoading && <Box width={"10px"}>loading</Box>}
        />
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
        {isError && (
          <Typography textAlign={"center"}>Nothing Found!</Typography>
        )}
        <LoadingButton
          sx={{ alignSelf: "end" }}
          variant="contained"
          loading={groupMutation.isLoading}
          disabled={groupMutation.isLoading}
          onClick={createGroup}
        >
          Create
        </LoadingButton>
      </Stack>
    </>
  );
}
