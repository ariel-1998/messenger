import { List, Avatar, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import { useQuery } from "@tanstack/react-query";
import { toastifyService } from "../../services/toastifyService";
import { userService } from "../../services/userService";
import CustomListItem from "../CustomComponents/CustomListItem";
import LoadingSkeletons from "../CustomComponents/LoadingSkeletons";
import { useNavigate } from "react-router-dom";
import { chatService } from "../../services/chatService";

type DrawerSearchProps = {
  toggleDrawer?: () => void;
};

const DrawerSearch: React.FC<DrawerSearchProps> = ({ toggleDrawer }) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const toggleDrowerFn = toggleDrawer || (() => undefined);

  const {
    data: users,
    isFetching: isUserFetch,
    isError,
  } = useQuery({
    queryKey: ["search", userSearch],
    queryFn: () => userService.searchUsers(userSearch),
    enabled: !!userSearch,
  });

  const { data: chat, isLoading } = useQuery({
    queryKey: ["chat", `{chat: ${userId}}`],
    queryFn: () => chatService.accessChat(userId || ""),
    onSuccess: (data) => {
      navigate(`/chat/${data?._id}`);
      toggleDrowerFn();
    },
    onError: () => toastifyService.info("User notFound"),
    enabled: !!userId,
  });

  useEffect(() => {
    if (userId && !isLoading) {
      navigate(`/chat/${chat?._id}`);
      toggleDrowerFn();
    }
  }, [userId]);

  const fetchUsers = () => {
    if (!searchRef.current?.value)
      return toastifyService.info("Fill Search bar!");
    setUserSearch(searchRef.current?.value);
  };

  const onUserClick = (userId: string) => {
    setUserId(userId);
  };

  return (
    <List sx={{ width: "100%" }}>
      <Stack mb={2} width={"100%"} alignItems={"center"}>
        <CustomSearchInput
          ref={searchRef}
          inputCursor="auto"
          placeholder="Search..."
          iconClick={fetchUsers}
          disabled={isUserFetch}
        />
      </Stack>

      {isError && <Typography align="center">Users not found!</Typography>}

      {isUserFetch && (
        <Stack height={"88vh"}>
          <LoadingSkeletons amount={12} />
        </Stack>
      )}
      {users && (
        <Stack spacing={1} pb={2}>
          {users.map((user) => (
            <CustomListItem
              onClick={() => onUserClick(user._id)}
              key={user._id}
              sx={{ height: "80px" }}
            >
              <Stack flexDirection={"row"} width={"100%"} alignItems={"center"}>
                <Stack spacing={1} p={2} width={"100%"}>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography>Email: {user.email}</Typography>
                </Stack>
                <Avatar src={user.image as string} />
              </Stack>
              {/* change to loading gif */}
              {isLoading && userId === user._id && (
                <Typography>loading...</Typography>
              )}
            </CustomListItem>
          ))}
        </Stack>
      )}
    </List>
  );
};

export default DrawerSearch;
