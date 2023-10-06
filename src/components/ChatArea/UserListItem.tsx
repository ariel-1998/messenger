import {
  SxProps,
  ListItemProps,
  Stack,
  Typography,
  Avatar,
  Theme,
} from "@mui/material";
import CustomListItem from "../CustomComponents/CustomListItem";
import { UserModel } from "../../models/UserModel";

type UserListItemProps = {
  user: UserModel;
  sx: SxProps<Theme>;
} & ListItemProps;

const UserListItem: React.FC<UserListItemProps> = ({ user, sx, ...rest }) => (
  <CustomListItem sx={{ height: "80px", ...sx }} {...rest}>
    <Stack flexDirection={"row"} width={"100%"} alignItems={"center"}>
      <Stack spacing={1} p={2} width={"100%"} justifyContent={"flex-end"}>
        <Typography variant="h6">{user.name}</Typography>
        <Typography>Email: {user.email}</Typography>
      </Stack>
      <Avatar src={user.image as string} />
    </Stack>
  </CustomListItem>
);

export default UserListItem;
