type UserListItemProps = {
  disableBtnProps?: boolean;
  onClick: () => void;
};

const UserListItem: React.FC<UserListItemProps> = ({
  disableBtnProps = false,
  onClick,
}) => {
  return (
    <button
      data-testid="user-list-item"
      onClick={onClick}
      disabled={disableBtnProps}
    >
      Mock User
    </button>
  );
};

type ChatListItemProps = {
  disableBtnProps?: boolean;
  onClick: () => void;
};

const ChatListItem: React.FC<ChatListItemProps> = ({
  disableBtnProps = false,
  onClick,
}) => {
  return (
    <button
      data-testid="chat-list-item"
      onClick={onClick}
      disabled={disableBtnProps}
    >
      Mock Chat
    </button>
  );
};

const ListItems = {
  User: UserListItem,
  Chat: ChatListItem,
};

export default ListItems;
