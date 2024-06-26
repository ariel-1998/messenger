import {
  Typography,
  Divider,
  Stack,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import GroupFormInput from "../GroupFormInput";
import SelectedUsersList from "../SelectedUsersList";
import UserList from "../UserList";
import { isUserInArr } from "../../../../utils/userMethods";
import { userService } from "../../../../services/userService";
import { UserModel } from "../../../../models/UserModel";
import { chatService } from "../../../../services/chatService";
import {
  ErrorModels,
  toastifyService,
} from "../../../../services/toastifyService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/reduxStore";
import ChildModal from "../../../CustomComponents/Modals/ChildModal";
import { LoadingButton } from "@mui/lab";
import { Search as SeachIcon } from "@mui/icons-material";
import LoadingSkeletons, {
  SkeletonUser,
} from "../../../CustomComponents/LoadingSkeletons";
import useSocket from "../../../../hooks/useSocket";
import { MENU_ITEM_PADDING } from "../../../../utils/constants";

type AddMemberToGroupProps = {
  handleParentModalClose: () => void;
  menuClose: () => void;
};

const AddMemberToGroup: React.FC<AddMemberToGroupProps> = ({
  handleParentModalClose,
  menuClose,
}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  return (
    <>
      <Box
        onClick={() => {
          menuClose();
          openModal();
        }}
        sx={MENU_ITEM_PADDING}
      >
        <Typography sx={{ fontWeight: "bold" }}>Add Members</Typography>
      </Box>
      <ChildModal
        sx={{ bgcolor: "#E5E5E5" }}
        open={open}
        handleClose={closeModal}
      >
        <ChildModalContent
          closeModalChild={closeModal}
          closeRootModal={handleParentModalClose}
        />
      </ChildModal>
    </>
  );
};

export default AddMemberToGroup;

type ChildModalContentProps = {
  closeModalChild(): void;
  closeRootModal(): void;
};

function ChildModalContent({
  closeRootModal,
  closeModalChild,
}: ChildModalContentProps) {
  const { socket } = useSocket();
  const [userSearch, setUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { debounce: debouncedOnInput, isLoading } = useDebounce({
    fn: onInput,
    wait: 700,
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

  const addMembersMutation = useMutation({
    mutationFn: chatService.addMembersToGroup,
    onError: (error: ErrorModels) => toastifyService.error(error),
    onSuccess: (data) => {
      closeModalChild();
      closeRootModal();
      toastifyService.success("Successfuly added new members!");
      socket?.emit("addingToGroup", data);
    },
  });

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

  const addMembers = () => {
    if (!selectedChat) return;
    addMembersMutation.mutate({
      groupId: selectedChat._id,
      users: selectedUsers,
    });
  };

  return (
    <Box>
      <Typography align="center" variant="h6" p={0} m={0}>
        ADD MEMBERS
      </Typography>
      <Divider />
      <Stack
        spacing={1}
        py={1}
        width={"100%"}
        margin={"auto"}
        boxSizing={"border-box"}
        justifyContent={"center"}
        alignItems={"center"}
      >
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
        <SelectedUsersList
          users={selectedUsers}
          setSelectedUsers={onDeleteUser}
        />

        {usersData && (
          <UserList
            users={usersData.filter(
              (user) =>
                !selectedChat?.users.some((myUser) => myUser._id === user._id)
            )}
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
        <Stack direction={"row"} spacing={1}>
          <Button color="error" variant="contained" onClick={closeModalChild}>
            Cancel
          </Button>
          <LoadingButton
            loading={addMembersMutation.isLoading}
            disabled={addMembersMutation.isLoading}
            variant="contained"
            onClick={addMembers}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
}
