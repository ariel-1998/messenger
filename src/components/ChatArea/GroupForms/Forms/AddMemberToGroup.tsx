import {
  Typography,
  Divider,
  Stack,
  Box,
  Button,
  Modal,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  isError,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { ChangeEvent, ReactNode, useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import CustomModal from "../../../CustomComponents/CustomModal";
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
import { useParams } from "react-router-dom";

function ChildModal({
  children,
  openBtn,
  closeBtn,
}: {
  children: ReactNode;
  openBtn: ReactNode;
  closeBtn: ReactNode;
}) {
  const theme = useTheme();
  const size = useMediaQuery(theme.breakpoints.down("xs"));
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: size ? "90vw" : 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  return (
    <>
      <span onClick={handleOpen}>{openBtn}</span>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          <Stack width={"100%"}>
            {children}
            <Stack width={"98%"}>
              <span style={{ alignSelf: "end" }} onClick={handleClose}>
                {closeBtn}
              </span>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

const AddMemberToGroup: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<UserModel[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { debounce: debouncedOnInput, isLoading } = useDebounce({
    fn: onInput,
    wait: 1500,
  });

  const { data: usersData, isError } = useQuery({
    queryKey: ["search", userSearch],
    queryFn: () => userService.searchUsers(userSearch),
    enabled: !!userSearch,
  });

  const addMembersMutation = useMutation({
    mutationFn: chatService.addMembersToGroup,
    onError: (error: ErrorModels) => toastifyService.error(error),
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
    if (!id) return toastifyService.error({ message: "group chat not found!" });
    addMembersMutation.mutate({
      groupId: id,
      users: selectedUsers,
    });
  };

  return (
    <ChildModal
      openBtn={<Button>Add Members</Button>}
      closeBtn={
        <Button
          sx={{ alignSelf: "end" }}
          variant="contained"
          onClick={addMembers}
        >
          Add
        </Button>
      }
    >
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
      </Stack>
    </ChildModal>
  );
};

export default AddMemberToGroup;
