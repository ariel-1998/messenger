import { ListItemProps, List } from "@mui/material";
import { UserModel } from "../../../models/UserModel";
import { isUserInArr } from "../../../utils/userMethods";
import ListItems from "./ListItems";

type UserListProps = {
  users: UserModel[];
  selectedUsers?: UserModel[];
  onUserClick?: (user: UserModel) => void;
} & ListItemProps;

const UserList: React.FC<UserListProps> = ({
  users,
  selectedUsers,
  onUserClick,
}) => {
  return (
    <List
      sx={{
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "48vh",
        margin: "auto",
      }}
    >
      {users?.map((user) => (
        <ListItems.User
          key={user._id}
          sx={{
            bgcolor:
              selectedUsers && isUserInArr(selectedUsers, user) === -1
                ? "#ddd"
                : "#bbdefb" || "#ddd",
            transition: "background-color 500ms ease",
          }}
          onClick={() => {
            if (!onUserClick) return;
            onUserClick(user);
          }}
          user={user}
        />
      ))}
    </List>
  );
};

export default UserList;
