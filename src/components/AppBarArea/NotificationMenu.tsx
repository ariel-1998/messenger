import React from "react";
import CustomMenu from "../CustomComponents/CustomMenu";
import { Notifications } from "@mui/icons-material";
import { Badge, MenuItem, Typography } from "@mui/material";
import { MENU_ITEM_PADDING } from "./ProfileMenu";
import { useUnreadMessages } from "../../contexts/UnreadMessagesProvider";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../utils/chatSlice";
import { ChatModel } from "../../models/ChatModel";

const NotificationMenu: React.FC = () => {
  const { unreadAmount, unreadMessages } = useUnreadMessages();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const NotificationIcon = (
    <Badge badgeContent={unreadAmount} color="error">
      <Notifications />
    </Badge>
  );

  const notifications = Object.entries(unreadMessages).map(
    ([key, messages]) => {
      const lastMessage = messages[messages.length - 1];
      const { chat } = lastMessage;
      const chatName = chat.isGroupChat
        ? chat.chatName
        : lastMessage.sender.name;
      return {
        chat,
        chatName,
        content: lastMessage.content,
        length: messages.length,
      };
    }
  );

  const onItemClick = (chat: ChatModel) => {
    dispatch(setSelectedChat({ chat, isExist: false }));
    handleClose();
  };

  return (
    <CustomMenu icon={NotificationIcon} open={open} onOpen={handleOpen}>
      {unreadAmount ? (
        notifications.map((val, i) => (
          <MenuItem
            key={i}
            sx={{ padding: 0 }}
            onClick={() => onItemClick(val.chat)}
          >
            <Typography sx={MENU_ITEM_PADDING}>
              {val.chatName}: {val.content}, {val.length}
            </Typography>
          </MenuItem>
        ))
      ) : (
        <MenuItem sx={{ padding: 0 }} onClick={handleClose}>
          <Typography sx={MENU_ITEM_PADDING}>No messages</Typography>
        </MenuItem>
      )}
    </CustomMenu>
  );
};

export default NotificationMenu;
