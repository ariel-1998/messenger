import { LoadingButton } from "@mui/lab";
import { Box, Button, Fade, Popper, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { chatService } from "../../../../services/chatService";
import { toastifyService } from "../../../../services/toastifyService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/reduxStore";

const LeaveGroup: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const elRef = useRef<HTMLButtonElement | null>(null);

  const handlePopper = () => {
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(elRef);
  const id = canBeOpen ? "spring-popper" : undefined;
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
      <LoadingButton onClick={handlePopper} ref={elRef}>
        Leave Group
      </LoadingButton>
      <Popper
        sx={{ zIndex: 2000, maxWidth: 250, minWidth: 250 }}
        id={id}
        open={open}
        anchorEl={elRef.current}
        placement={"top"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box sx={{ border: 1, p: 2, pb: 1, bgcolor: "#999" }}>
              <Typography>
                Are you sure you want to leave this group??
              </Typography>
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
                  size="small"
                  onClick={onDelete}
                  loading={LeaveGroupMutation.isLoading}
                  disabled={LeaveGroupMutation.isLoading}
                >
                  Leave
                </LoadingButton>
                <Button
                  disabled={LeaveGroupMutation.isLoading}
                  sx={{ bgcolor: "#ffff32", color: "black" }}
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
    </>
  );
};

export default LeaveGroup;
