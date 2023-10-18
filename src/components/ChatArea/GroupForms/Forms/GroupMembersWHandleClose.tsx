import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/reduxStore";
import UserList from "../UserList";
import {
  Box,
  Button,
  List,
  Modal,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import ChildModal from "../../../CustomComponents/ChildModal";
import { useMutation } from "@tanstack/react-query";
import { chatService } from "../../../../services/chatService";
import {
  ErrorModels,
  toastifyService,
} from "../../../../services/toastifyService";
import Delete from "@mui/icons-material/HighlightOffRounded";
import UserListItem from "../UserListItem";
import { UserModel } from "../../../../models/UserModel";

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
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const users = selectedChat?.users || [];
  const handleModalClose = handleChildModalClose || (() => undefined);

  const removeMembersMutation = useMutation({
    mutationFn: chatService.removeMembersFromGroup,
    onError: (error: ErrorModels) => toastifyService.error(error),
    onSuccess: () => toastifyService.success("Member was successfuly removed!"),
  });

  const onIconClick = (userId: string) => {
    if (!selectedChat) return;
    removeMembersMutation.mutate({
      groupId: selectedChat._id,
      userId,
    });
  };

  const ModalOpenBtn = (
    <Delete
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        fill: "white",
      }}
    />
  );
  const RemoveUserBtn = ({ userId }: { userId: string }) => (
    <Button onClick={() => onIconClick(userId)}>Remove</Button>
  );
  const ModalCloseBtn = <Button>Cancel</Button>;
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
        {users.map((user) => (
          <UserListItem user={user} key={user._id}>
            <MiniModal
              customBtn={<RemoveUserBtn userId={user._id} />}
              openBtn={ModalOpenBtn}
              closeBtn={ModalCloseBtn}
            >
              <Typography>
                Are you sure you wanr to Remove {user.name}?
              </Typography>
            </MiniModal>
          </UserListItem>
        ))}
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

type MiniModalProps = {
  children: ReactNode;
  openBtn: ReactNode;
  closeBtn: ReactNode;
  customBtn: ReactNode;
};

function MiniModal({
  children,
  openBtn,
  closeBtn,
  customBtn,
}: MiniModalProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

  return (
    <>
      <span onClick={handleOpen}>{openBtn}</span>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Stack width={"100%"}>
            {children}

            <span onClick={handleClose}>
              {closeBtn}
              {customBtn}
            </span>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
