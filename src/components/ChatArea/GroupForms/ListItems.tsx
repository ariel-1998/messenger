import {
  SxProps,
  ListItemProps,
  Stack,
  Typography,
  Avatar,
  Theme,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CustomListItem from "../../CustomComponents/CustomListItem";
import { UserModel } from "../../../models/UserModel";
import { ReactNode } from "react";
import { ChatModel } from "../../../models/ChatModel";
import { findUserInChat } from "../../../utils/userMethods";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import { urlImageOptimize } from "../../../utils/urlImageOptimize";

type UserListItemProps = {
  user: UserModel;
  sx?: SxProps<Theme>;
  children?: ReactNode;
  disableRipple?: boolean;
  disableBtnProps?: boolean;
} & ListItemProps;

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  disableBtnProps = false,
  disableRipple = false,
  sx,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const size = useMediaQuery(theme.breakpoints.down("sm"));
  const url = urlImageOptimize.generateIconImageUrl(user?.image as string);

  return (
    <CustomListItem
      disableBtnProps={disableBtnProps}
      sx={{ position: "relative", ...sx }}
      {...rest}
      disableRipple={disableRipple}
    >
      <Stack width={"100%"} height={"100%"}>
        <Stack
          flexDirection={"row"}
          width={"100%"}
          pt={children ? 1 : 0}
          alignItems={"start"}
        >
          <Typography
            sx={{
              width: "70%",
              display: "inline-block",
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontWeight: "bold",
            }}
            variant="h6"
          >
            {user.name}
          </Typography>
          <Stack width={"30%"}>
            <Avatar
              sx={{
                alignSelf: "end",
                justifySelf: "start",
                width: 50,
                aspectRatio: 50,
              }}
              src={url}
            />
          </Stack>
        </Stack>

        <Typography
          sx={{
            display: "inline-block",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "90%",
            fontWeight: "bold",
            color: "#666",
          }}
        >
          {!size && "Email: "}
          {user.email.toLowerCase()}
        </Typography>
        {children}
      </Stack>
    </CustomListItem>
  );
};

type ChatListItemProps = {
  chat: ChatModel;
  sx?: SxProps<Theme>;
  disableRipple?: boolean;
  disableBtnProps?: boolean;
} & ListItemProps;

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  sx,
  disableBtnProps = false,
  disableRipple = false,
  ...rest
}) => {
  const user = useSelector((state: RootState) => state.auth);
  const isLoggedUserIsSender = chat.latestMessage?.sender?._id === user?._id;

  return (
    <CustomListItem
      sx={{ position: "relative", ...sx }}
      disableBtnProps={disableBtnProps}
      disableRipple={disableRipple}
      {...rest}
    >
      <Stack width={"100%"} height={"100%"}>
        <Stack flexDirection={"row"} width={"100%"} pt={1} alignItems={"start"}>
          <Typography
            sx={{
              width: "70%",
              display: "inline-block",
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontWeight: "bold",
            }}
            variant="h6"
          >
            {chat.isGroupChat
              ? chat.chatName
              : findUserInChat(chat, user)?.name}
          </Typography>
          <Stack width={"30%"}>
            <Avatar
              sx={{
                alignSelf: "end",
                justifySelf: "start",
                width: 50,
                aspectRatio: 50,
              }}
              src={
                chat.isGroupChat
                  ? urlImageOptimize.generateIconImageUrl(chat.groupImg)
                  : urlImageOptimize.generateIconImageUrl(
                      findUserInChat(chat, user)?.image as string
                    )
              }
              // src={
              //   chat.isGroupChat
              //     ? chat.groupImg
              //     : (findUserInChat(chat, user)?.image as string)
              // }
            />
          </Stack>
        </Stack>

        <Typography
          height="1.5rem"
          sx={{
            color: "#666",
            display: "inline-block",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontWeight: "600",
          }}
        >
          {!!chat.latestMessage &&
            `${
              !isLoggedUserIsSender ? chat.latestMessage.sender?.name : "You"
            }: `}
          <span style={{ color: "black" }}>{chat.latestMessage?.content}</span>
        </Typography>
      </Stack>
    </CustomListItem>
  );
};

const ListItems = {
  User: UserListItem,
  Chat: ChatListItem,
};

export default ListItems;
