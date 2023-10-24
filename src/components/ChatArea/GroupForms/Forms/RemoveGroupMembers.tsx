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
} from "@mui/material";
import ChildModal from "../../../CustomComponents/Modals/ChildModal";
import { useMutation } from "@tanstack/react-query";
import { chatService } from "../../../../services/chatService";
import { toastifyService } from "../../../../services/toastifyService";
import Delete from "@mui/icons-material/HighlightOffRounded";
import { LoadingButton } from "@mui/lab";
import { UserModel } from "../../../../models/UserModel";
import { ChatModel } from "../../../../models/ChatModel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ListItems from "../ListItems";
import ProfileModal from "../../../ProfileArea/ProfileModal";

const RemoveGroupMembers: React.FC = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);
  return (
    <>
      <IconButton onClick={openModal} sx={{ p: 0 }}>
        <VisibilityIcon />
      </IconButton>
      <ChildModal sx={{ pb: 2 }} open={open} handleClose={closeModal}>
        <Stack spacing={1}>
          <List
            sx={{
              width: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "48vh",
              margin: "auto",
            }}
          >
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

  const handlePopper = () => {
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(elRef);
  const id = canBeOpen ? "spring-popper" : undefined;

  const removeMembersMutation = useMutation({
    mutationFn: chatService.removeMembersFromGroup,
    onError: (error) => toastifyService.error(error),
    onSuccess: () => toastifyService.success("successfuly removed!"),
  });

  const onDelete = () => {
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
          top: 1,
          left: 1,
          height: 28,
          width: 28,
        }}
        onClick={handlePopper}
      >
        <Delete sx={{ fill: "#E3735E" }} />
      </IconButton>
      <Popper
        sx={{ zIndex: 2000, maxWidth: 250, minWidth: 250 }}
        id={id}
        open={open}
        anchorEl={elRef.current}
        placement={"bottom-start"}
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
          <ListItems.User disableRipple user={user} key={user._id}>
            {isAdmin && <UserPopper user={user} chat={selectedChat} />}
            <ProfileModal.User btnText="viewProfile" isBtn profile={user} />
          </ListItems.User>
        ))}
    </>
  );
}
