import { Typography, Divider, Stack, Box, Button } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
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

type AddMemberToGroupProps = {
  handleModalClose: () => void;
  handleChildModalClose?: () => void;
};

const AddMemberToGroup: React.FC<AddMemberToGroupProps> = ({
  handleModalClose,
  handleChildModalClose,
}) => {
  const childModalClose = handleChildModalClose || (() => undefined);

  function closeModals() {
    childModalClose();
    handleModalClose();
  }
  const OpenBtn = <Button>Add Members</Button>;

  return (
    <ChildModal openBtn={OpenBtn}>
      <ChildModalContent modalsClose={closeModals} />
    </ChildModal>
  );
};

export default AddMemberToGroup;

type ChildModalContentProps = {
  modalsClose(): void;
};

function ChildModalContent({ modalsClose }: ChildModalContentProps) {
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { debounce: debouncedOnInput, isLoading } = useDebounce({
    fn: onInput,
    wait: 700,
  });

  const { data: usersData, isError } = useQuery({
    queryKey: ["search", userSearch],
    queryFn: () => userService.searchUsers(userSearch),
    enabled: !!userSearch,
  });

  const addMembersMutation = useMutation({
    mutationFn: chatService.addMembersToGroup,
    onError: (error: ErrorModels) => toastifyService.error(error),
    onSuccess: modalsClose,
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
          endAdornment={<>{isLoading && <Box width={"10px"}>loading</Box>}</>}
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
          loading={addMembersMutation.isLoading}
          disabled={addMembersMutation.isLoading}
          sx={{ alignSelf: "end" }}
          variant="contained"
          onClick={addMembers}
        >
          Add
        </LoadingButton>
      </Stack>
    </Box>
  );
}
