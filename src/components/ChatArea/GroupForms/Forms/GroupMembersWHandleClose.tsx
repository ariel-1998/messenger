import React, { useRef } from "react";
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
import {
  ErrorModels,
  toastifyService,
} from "../../../../services/toastifyService";
import Delete from "@mui/icons-material/HighlightOffRounded";
import UserListItem from "../UserListItem";
import { LoadingButton } from "@mui/lab";
import { UserModel } from "../../../../models/UserModel";
import { ChatModel } from "../../../../models/ChatModel";

const GroupMembersWHandleClose: React.FC = () => {
  const OpenBtn = <Button>Members</Button>;
  return (
    <ChildModal sx={{ pb: 2 }} openBtn={OpenBtn}>
      <ModalContent />
    </ChildModal>
  );
};

export default GroupMembersWHandleClose;

type ModalContentProps = {
  handleChildModalClose?: () => void;
};

function ModalContent({
  handleChildModalClose,
}: ModalContentProps): JSX.Element {
  const handleModalClose = handleChildModalClose || (() => undefined);

  return (
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
        onClick={handleModalClose}
      >
        Close
      </Button>
    </Stack>
  );
}

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
    onError: (error: ErrorModels) => toastifyService.error(error),
    onSuccess: () => toastifyService.success("Member was successfuly removed!"),
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
          zIndex: 100000,
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

  return (
    <>
      {selectedChat &&
        users.map((user) => (
          <UserListItem user={user} key={user._id}>
            <UserPopper user={user} chat={selectedChat} />
          </UserListItem>
        ))}
    </>
  );
}
