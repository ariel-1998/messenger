import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { chatService } from "../../../../services/chatService";
import {
  ErrorModels,
  toastifyService,
} from "../../../../services/toastifyService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/reduxStore";
import { LoadingButton } from "@mui/lab";
import ChildModal from "../../../CustomComponents/Modals/ChildModal";
import useSocket from "../../../../hooks/useSocket";
import { MENU_ITEM_PADDING } from "../../../../utils/constants";

type DeleteGroupChatProps = {
  handleModalClose(): void;
  menuClose(): void;
};

const DeleteGroupChat: React.FC<DeleteGroupChatProps> = ({
  handleModalClose,
  menuClose,
}) => {
  const { socket } = useSocket();
  const deleteMutation = useMutation({
    mutationFn: chatService.deleteGroupChat,
    onError: (err: ErrorModels) => toastifyService.error(err),
    onSuccess: () => {
      socket?.emit("deletingGroup", selectedChat);
      handleModalClose();
    },
  });

  const onDelete = () => {
    if (!selectedChat?._id) return;
    deleteMutation.mutate(selectedChat._id);
  };

  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Box
        onClick={() => {
          menuClose();
          handleOpen();
        }}
        sx={MENU_ITEM_PADDING}
      >
        <Typography sx={{ fontWeight: "bold" }}>Delete group</Typography>
      </Box>

      <ChildModal
        sx={{ maxWidth: 300, pb: 1 }}
        open={open}
        handleClose={handleClose}
      >
        <Typography>
          Are you sure you want to delete {selectedChat?.chatName} group?
        </Typography>
        <Divider />
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
            sx={{
              bgcolor: "#ffff32",
              color: "black",
              ":hover": { bgcolor: "#ffff32" },
            }}
            loading={deleteMutation.isLoading}
            disabled={deleteMutation.isLoading}
            onClick={onDelete}
          >
            Delete
          </LoadingButton>
          <Button
            color="error"
            variant="contained"
            onClick={handleClose}
            disabled={deleteMutation.isLoading}
          >
            Cancel
          </Button>
        </Stack>
      </ChildModal>
    </>
  );
};

export default DeleteGroupChat;
