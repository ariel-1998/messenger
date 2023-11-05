import { LoadingButton } from "@mui/lab";
import { Box, Button, Fade, Popper, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { chatService } from "../../../../services/chatService";
import { toastifyService } from "../../../../services/toastifyService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/reduxStore";
import { Logout } from "@mui/icons-material";
import ChildModal from "../../../CustomComponents/Modals/ChildModal";

const LeaveGroup: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth);

  const LeaveGroupMutation = useMutation({
    mutationFn: chatService.removeMembersFromGroup,
    onError: (err) => toastifyService.error(err),
    onSuccess: () => toastifyService.success("successfuly removed!"),
  });

  const onDelete = () => {
    if (!user?._id || !selectedChat) return;
    LeaveGroupMutation.mutate({
      groupId: selectedChat._id,
      userId: user._id,
    });
  };

  return (
    <>
      <Button
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          ":hover": { background: "rgba(255,255,255,0.2)" },
        }}
        color="error"
        onClick={handleOpen}
      >
        <Logout sx={{ fill: "red" }} />
      </Button>
      <ChildModal
        sx={{ maxWidth: 300, pb: 1 }}
        open={open}
        handleClose={handleClose}
      >
        <Box>
          <Typography>Are you sure you want to leave this group?</Typography>
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
              color="error"
              onClick={onDelete}
              loading={LeaveGroupMutation.isLoading}
              disabled={LeaveGroupMutation.isLoading}
            >
              Leave
            </LoadingButton>
            <Button
              disabled={LeaveGroupMutation.isLoading}
              sx={{
                bgcolor: "#ffff32",
                color: "black",
                ":hover": { bgcolor: "#ffff32" },
              }}
              variant="contained"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </ChildModal>
    </>
  );
};

export default LeaveGroup;
