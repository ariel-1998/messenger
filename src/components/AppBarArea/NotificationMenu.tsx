import React, { useState } from "react";
import CustomMenu from "../CustomComponents/CustomMenu";
import { Notifications } from "@mui/icons-material";
import { Badge, MenuItem, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../utils/chatSlice";
import { ChatModel } from "../../models/ChatModel";
import useUnreadMessages from "../../hooks/useUnreadMessages";
import { MENU_ITEM_PADDING } from "../../utils/constants";

const NotificationMenu: React.FC = () => {
  const { unreadAmount, unreadMessages } = useUnreadMessages();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notifications = Object.entries(unreadMessages).map(([_, messages]) => {
    const lastMessage = messages[messages.length - 1];
    const { chat } = lastMessage;
    const chatName = chat.isGroupChat ? chat.chatName : lastMessage.sender.name;
    return {
      chat,
      chatName,
      content: lastMessage.content,
      length: messages.length,
    };
  });

  const onItemClick = (chat: ChatModel) => {
    dispatch(setSelectedChat({ chat, checkIfExists: true }));
    handleClose();
  };

  return (
    <CustomMenu
      role="notification-menu"
      icon={<NotificationIcon unreadAmount={unreadAmount} />}
      open={open}
      onOpen={handleOpen}
    >
      {unreadAmount ? (
        notifications.map((val, i) => (
          <MenuItem
            key={i}
            onClick={() => onItemClick(val.chat)}
            sx={{ padding: 0 }}
          >
            <Stack
              direction={"row"}
              sx={MENU_ITEM_PADDING}
              alignItems={"center"}
            >
              <Typography color={"#2c387e"} fontWeight={"bold"} pr={1}>
                {val.chatName}:
              </Typography>
              <Typography pr={1}>
                {val.content.length > 20
                  ? val.content.slice(0, 17) + "..."
                  : val.content}
              </Typography>
              <Stack
                borderRadius={"50%"}
                color={"white"}
                bgcolor={"#aaaaaa77"}
                width={"1.2em"}
                height={"1.2em"}
              >
                <Typography m={"auto"} fontSize={"0.9rem"}>
                  {val.length}
                </Typography>
              </Stack>
            </Stack>
          </MenuItem>
        ))
      ) : (
        <MenuItem sx={{ padding: 0 }} onClick={handleClose}>
          <Typography sx={MENU_ITEM_PADDING} color={"#333"} fontWeight={"bold"}>
            No messages
          </Typography>
        </MenuItem>
      )}
    </CustomMenu>
  );
};

export default NotificationMenu;

type NotificationIconProps = {
  unreadAmount: number;
};
function NotificationIcon({ unreadAmount }: NotificationIconProps) {
  return (
    <Badge badgeContent={unreadAmount} color="error">
      <Notifications sx={{ fill: "#E5E5E5" }} />
    </Badge>
  );
}
