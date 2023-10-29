import React from "react";
import CustomMenu from "../CustomComponents/CustomMenu";
import { Notifications } from "@mui/icons-material";
import { Badge, MenuItem, Typography } from "@mui/material";
import { MENU_ITEM_PADDING } from "./ProfileMenu";
import { useUnreadMessages } from "../../contexts/UnreadMessagesProvider";

const NotificationMenu: React.FC = () => {
  const { unreadAmount, unreadMessages } = useUnreadMessages();

  const [open, setOpen] = React.useState(false);

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
        chatName,
        content: lastMessage.content,
        length: messages.length,
      };
    }
  );

  return (
    <CustomMenu icon={NotificationIcon} open={open} onOpen={handleOpen}>
      {notifications?.map((val, i) => (
        <MenuItem key={i} sx={{ padding: 0 }} onClick={handleClose}>
          <Typography sx={MENU_ITEM_PADDING}>
            {val.chatName}: {val.content}, {val.length}
          </Typography>
        </MenuItem>
      ))}
    </CustomMenu>
  );
};

export default NotificationMenu;
