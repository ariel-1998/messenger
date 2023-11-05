import React, { ChangeEvent, useState } from "react";
import {
  Divider,
  Stack,
  Typography,
  Box,
  Button,
  InputLabel,
  Input,
  CircularProgress,
} from "@mui/material";
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
import { Add, Search as SeachIcon } from "@mui/icons-material";
import CustomModal from "../../../CustomComponents/Modals/CustomModal";
import LoadingSkeletons, {
  SkeletonUser,
} from "../../../CustomComponents/LoadingSkeletons";
import { useSocket } from "../../../../contexts/SocketProvider";

const CreateGroupChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          p: 0,
          fontSize: "1.1rem",
          fontWeight: 600,
          lineHeight: 1.5,
          color: "#0B4F6C",
        }}
        variant="text"
      >
        new group <Add />
      </Button>
      <CustomModal
        open={open}
        handleClose={handleClose}
        sx={{ top: "5vh", pb: 0, bgcolor: "#E5E5E5" }}
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
  const [groupImg, setGroupImg] = useState<FileList | null>(null);
  const { socket } = useSocket();
  const { debounce: debouncedOnInput, isLoading } = useDebounce({
    fn: onInput,
    wait: 1500,
  });

  const {
    data: usersData,
    isError,
    isFetching: fetchingUserData,
  } = useQuery({
    queryKey: ["search", userSearch],
    queryFn: () => userService.searchUsers(userSearch),
    enabled: !!userSearch,
  });

  const groupMutation = useMutation({
    mutationFn: chatService.createGroupChat,
    onError: (err: ErrorModels) => toastifyService.error(err),
    onSuccess: (data) => {
      socket?.emit("addingToGroup", data);
      handleClose();
    },
  });

  const imageMutation = useMutation({
    mutationFn: userService.uploadImage,
    onError: () =>
      toastifyService.error({
        message: "There was an error, please try again later.",
      }),
  });

  const createGroup = () => {
    try {
      createGroupSchema.parse({
        chatName: groupName,
        users: selectedUsers,
        groupImg,
      });
      if (groupImg) {
        imageMutation.mutateAsync(groupImg).then((data) => {
          groupMutation.mutate({
            users: selectedUsers,
            chatName: groupName,
            groupImg: data.url,
          });
        });
      } else {
        groupMutation.mutate({
          users: selectedUsers,
          chatName: groupName,
        });
      }
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
          endAdornment={
            isLoading ? (
              <CircularProgress size={20} sx={{ ml: 1 }} />
            ) : (
              <SeachIcon sx={{ ml: 1, fill: "#999" }} />
            )
          }
        />
        <Box>
          <InputLabel>Group image</InputLabel>
          <Input
            type="file"
            onChange={(e) => {
              setGroupImg((e.target as HTMLInputElement).files);
            }}
          />
        </Box>
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
        {fetchingUserData && (
          <Stack
            spacing={1}
            maxHeight={"40vh"}
            width={"100%"}
            overflow={"hidden"}
          >
            <LoadingSkeletons amount={5}>
              <SkeletonUser />
            </LoadingSkeletons>
          </Stack>
        )}
        {isError && (
          <Typography textAlign={"center"}>Nothing Found!</Typography>
        )}
        <Stack direction={"row"} columnGap={1} alignSelf="end">
          <Button
            color="error"
            sx={{ alignSelf: "end" }}
            variant="contained"
            onClick={handleClose}
          >
            cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={groupMutation.isLoading}
            disabled={groupMutation.isLoading}
            onClick={createGroup}
          >
            Create
          </LoadingButton>
        </Stack>
      </Stack>
    </>
  );
}
