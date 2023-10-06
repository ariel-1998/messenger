import { ListItemProps, List } from "@mui/material";
import { UserModel } from "../../models/UserModel";
import { isUserInArr } from "../../utils/userMethods";
import UserListItem from "./UserListItem";

type UserListProps = {
  users: UserModel[];
  selectedUsers: UserModel[];
  onUserClick: (user: UserModel) => void;
} & ListItemProps;

const UserList: React.FC<UserListProps> = ({
  users,
  selectedUsers,
  onUserClick,
}) => {
  return (
    <List
      sx={{
        width: "90%",
        zIndex: 1,
        overflow: "auto",
        maxHeight: "60vh",
        margin: "auto",
      }}
    >
      {users?.map((user) => (
        <UserListItem
          key={user._id}
          sx={{
            bgcolor:
              isUserInArr(selectedUsers, user) === -1 ? "#ddd" : "#bbdefb",
            transition: "background-color 500ms ease",
          }}
          onClick={() => onUserClick(user)}
          user={user}
        />
      ))}
    </List>
  );
};

export default UserList;
