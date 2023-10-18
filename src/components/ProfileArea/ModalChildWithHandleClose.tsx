import React from "react";
import { ChatModel } from "../../models/ChatModel";
import { Box, Typography, Divider, Button } from "@mui/material";
import GroupForm from "../ChatArea/GroupForms/Forms/GroupForm";
import GroupMembersWHandleClose from "../ChatArea/GroupForms/Forms/GroupMembersWHandleClose";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";

interface ModalChildWithHandleCloseProps {
  handleClose?: () => void;
  chat: ChatModel;
}

const ModalChildWithHandleClose: React.FC<ModalChildWithHandleCloseProps> = ({
  handleClose,
  chat,
}) => {
  const modalClose = handleClose || (() => undefined);
  const user = useSelector((state: RootState) => state.auth);
  const userId = user?._id;
  const adminId = chat.groupAdmin._id;
  const isUserAdmin = adminId === userId;
  return (
    <>
      <Box>
        <Typography align="center" variant="h6" p={0} m={0}>
          Profile
        </Typography>
        <Divider />

        <Typography variant="h4" component="h2">
          {chat?.chatName}
        </Typography>
        {/* <Avatar sx={{ width: 150, height: 150 }} src={group?.image as string} /> */}
        <GroupMembersWHandleClose />
        <GroupForm.Rename
          handleModalClose={modalClose}
          groupName={chat.chatName}
          groupId={chat._id}
        />
        {isUserAdmin && (
          <>
            <GroupForm.AddMembers handleModalClose={modalClose} />
            <Button>remove users from group</Button>
          </>
        )}
      </Box>
    </>
  );
};

export default ModalChildWithHandleClose;
