import {
  Box,
  Button,
  Divider,
  Fade,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { chatService } from "../../../../services/chatService";
import {
  ErrorModels,
  toastifyService,
} from "../../../../services/toastifyService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/reduxStore";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import ChildModal from "../../../CustomComponents/Modals/ChildModal";
type DeleteGroupChatProps = {
  handleModalClose(): void;
  menuClose(): void;
};

const DeleteGroupChat: React.FC<DeleteGroupChatProps> = ({
  handleModalClose,
  menuClose,
}) => {
  // const { selectedChat } = useSelector((state: RootState) => state.chat);
  // const [open, setOpen] = React.useState(false);
  // const elRef = useRef<HTMLButtonElement | null>(null);

  // const handlePopper = () => {
  //   setOpen((previousOpen) => !previousOpen);
  // };

  // const canBeOpen = open && Boolean(elRef);
  // const id = canBeOpen ? "spring-popper" : undefined;

  // const deleteMutation = useMutation({
  //   mutationFn: chatService.deleteGroupChat,
  //   onError: (err: ErrorModels) => toastifyService.error(err),
  //   onSuccess: handleModalClose,
  // });

  // const onDelete = () => {
  //   if (!selectedChat?._id) return;
  //   deleteMutation.mutate(selectedChat._id);
  // };

  const deleteMutation = useMutation({
    mutationFn: chatService.deleteGroupChat,
    onError: (err: ErrorModels) => toastifyService.error(err),
    onSuccess: handleModalClose,
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
      <Button
        onClick={() => {
          menuClose();
          handleOpen();
        }}
      >
        Delete group <DeleteIcon />
      </Button>
      <ChildModal open={open} handleClose={handleClose}>
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
            size="small"
            sx={{ bgcolor: "#ffff32", color: "black" }}
            loading={deleteMutation.isLoading}
            disabled={deleteMutation.isLoading}
            onClick={onDelete}
          >
            Delete
          </LoadingButton>
          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={handleClose}
            disabled={deleteMutation.isLoading}
          >
            Cancel
          </Button>
        </Stack>
      </ChildModal>
    </>
    // <div>
    //   <Button onClick={handlePopper} ref={elRef}>
    //     Delete group <DeleteIcon />
    //   </Button>
    //   <Popper
    //     sx={{ zIndex: 2000, maxWidth: 250, minWidth: 250 }}
    //     id={id}
    //     open={open}
    //     anchorEl={elRef.current}
    //     placement={"bottom-start"}
    //     transition
    //   >
    //     {({ TransitionProps }) => (
    //       <Fade {...TransitionProps} timeout={350}>
    //         <Box sx={{ border: 1, p: 2, pb: 1, bgcolor: "#999" }}>
    //           <Typography>
    //             Are you sure you want to delete {selectedChat?.chatName} group?
    //           </Typography>
    //           <Stack
    //             direction={"row"}
    //             columnGap={1}
    //             pt={1}
    //             width={"100%"}
    //             justifyContent={"center"}
    //             px={1}
    //           >
    //             <LoadingButton
    //               variant="contained"
    //               size="small"
    //               sx={{ bgcolor: "#ffff32", color: "black" }}
    //               loading={deleteMutation.isLoading}
    //               disabled={deleteMutation.isLoading}
    //               onClick={onDelete}
    //             >
    //               Delete
    //             </LoadingButton>
    //             <Button
    //               color="error"
    //               variant="contained"
    //               size="small"
    //               onClick={handlePopper}
    //               disabled={deleteMutation.isLoading}
    //             >
    //               Cancel
    //             </Button>
    //           </Stack>
    //         </Box>
    //       </Fade>
    //     )}
    //   </Popper>
    // </div>
  );
};

export default DeleteGroupChat;
