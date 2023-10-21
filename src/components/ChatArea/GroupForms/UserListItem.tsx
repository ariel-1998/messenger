import {
  SxProps,
  ListItemProps,
  Stack,
  Typography,
  Avatar,
  Theme,
  ListItemButtonProps,
} from "@mui/material";
import CustomListItem from "../../CustomComponents/CustomListItem";
import { UserModel } from "../../../models/UserModel";
import { ReactNode } from "react";

type UserListItemProps = {
  user: UserModel;
  sx?: SxProps<Theme>;
  children?: ReactNode;
  listBtnProps?: ListItemButtonProps;
} & ListItemProps;

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  sx,
  listBtnProps,
  children,
  ...rest
}) => (
  <CustomListItem
    sx={{ height: "90px", position: "relative", ...sx }}
    {...rest}
  >
    {children}
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
          }}
          variant="h6"
        >
          {user.name}
        </Typography>
        <Stack width={"30%"}>
          <Avatar
            sx={{ alignSelf: "end", justifySelf: "start" }}
            src={user.image as string}
          />
        </Stack>
      </Stack>

      <Typography
        sx={{
          display: "inline-block",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        Email: {user.email.toLowerCase()}
      </Typography>
    </Stack>
  </CustomListItem>
);

export default UserListItem;
