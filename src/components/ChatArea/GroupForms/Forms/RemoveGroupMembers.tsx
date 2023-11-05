import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/reduxStore";
import {
  Box,
  Button,
  IconButton,
  Fade,
  List,
  Popper,
  Stack,
  Typography,
  Divider,
} from "@mui/material";
import ChildModal from "../../../CustomComponents/Modals/ChildModal";
import { useMutation } from "@tanstack/react-query";
import { chatService } from "../../../../services/chatService";
import { toastifyService } from "../../../../services/toastifyService";
import { LoadingButton } from "@mui/lab";
import { UserModel } from "../../../../models/UserModel";
import { ChatModel } from "../../../../models/ChatModel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ListItems from "../ListItems";
import ProfileModal from "../../../ProfileArea/ProfileModal";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import { useSocket } from "../../../../contexts/SocketProvider";

const RemoveGroupMembers: React.FC = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);
  return (
    <>
      <IconButton
        onClick={openModal}
        sx={{ ":hover": { background: "rgba(255,255,255,0.2)" } }}
      >
        <VisibilityIcon sx={{ fill: "white" }} />
      </IconButton>

      <ChildModal
        sx={{ pb: 1, bgcolor: "#fff" }}
        open={open}
        handleClose={closeModal}
      >
        <Stack spacing={1}>
          <List
            sx={{
              width: "100%",
              overflowY: "auto",
              display: "flex",
              maxHeight: "70vh",
              flexDirection: "column",
              rowGap: 0.1,
            }}
          >
            <Typography textAlign={"center"}>USERS</Typography>
            <Divider flexItem sx={{ mb: 1 }} />
            <UserPopperList />
          </List>
          <Button
            variant="contained"
            sx={{ alignSelf: "end" }}
            onClick={closeModal}
          >
            Close
          </Button>
        </Stack>
      </ChildModal>
    </>
  );
};

export default RemoveGroupMembers;

type UserPopperProps = {
  user: UserModel;
  chat: ChatModel;
};

function UserPopper({ user, chat }: UserPopperProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const elRef = useRef<HTMLButtonElement | null>(null);
  const { socket } = useSocket();

  const handlePopper = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(elRef);
  const id = canBeOpen ? "spring-popper" : undefined;

  const removeMembersMutation = useMutation({
    mutationFn: chatService.removeMembersFromGroup,
    onError: (error) => toastifyService.error(error),
    onSuccess: (data) => {
      setOpen((previousOpen) => !previousOpen);
      toastifyService.success("successfuly removed!");
      socket?.emit("removingFromGroup", data, user);
    },
  });

  const onDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    removeMembersMutation.mutate({
      groupId: chat._id,
      userId: user._id,
    });
  };

  return (
    <div>
      <IconButton
        ref={elRef}
        size="small"
        sx={{
          position: "absolute",
          bottom: 2,
          right: 10,
          height: 28,
          width: 28,
          ":hover": { backgroundColor: "#E3735E22" },
        }}
        onClick={(e) => handlePopper(e)}
      >
        <PersonRemoveAlt1Icon sx={{ fill: "#E3735E" }} />
      </IconButton>
      <Popper
        sx={{ zIndex: 2000, maxWidth: 250, minWidth: 250 }}
        id={id}
        open={open}
        anchorEl={elRef.current}
        placement={"bottom-end"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box sx={{ border: 1, p: 2, pb: 1, bgcolor: "#999" }}>
              <Typography>Remove {user.name} from group?</Typography>
              <Stack
                direction={"row"}
                columnGap={1}
                pt={1}
                width={"100%"}
                justifyContent={"center"}
                px={1}
              >
                <LoadingButton
                  variant="contained"
                  size="small"
                  sx={{ bgcolor: "#ffff32", color: "black" }}
                  onClick={onDelete}
                  loading={removeMembersMutation.isLoading}
                  disabled={removeMembersMutation.isLoading}
                >
                  Delete
                </LoadingButton>
                <Button
                  disabled={removeMembersMutation.isLoading}
                  color="error"
                  variant="contained"
                  size="small"
                  onClick={handlePopper}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
}

function UserPopperList(): JSX.Element {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const users = selectedChat?.users || [];
  const loggedUser = useSelector((state: RootState) => state.auth);
  const isAdmin = loggedUser?._id === selectedChat?.groupAdmin?._id;

  return (
    <>
      {selectedChat &&
        users.map((user) => (
          <ProfileModal.User
            key={user._id}
            sx={{ ":hover": { bgcolor: "rgba(187, 222, 251, 0.3)" } }}
            profile={user}
            CustomBtn={
              <ListItems.User disableRipple user={user}>
                {isAdmin && <UserPopper user={user} chat={selectedChat} />}
              </ListItems.User>
            }
          />
        ))}
    </>
  );
}
