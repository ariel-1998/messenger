import { List, Avatar, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toastifyService } from "../../services/toastifyService";
import { userService } from "../../services/userService";
import CustomListItem from "../CustomComponents/CustomListItem";
import LoadingSkeletons from "../CustomComponents/LoadingSkeletons";
import { chatService } from "../../services/chatService";
import { useDrawer } from "../../contexts/DrawerProvider";
import useDebounce from "../../hooks/useDebounce";

const DrawerSearch: React.FC = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [userSearch, setUserSearch] = useState("");
  const { closeDrawer } = useDrawer();
  const { debounce, isLoading } = useDebounce({ fn: fetchUsers, wait: 700 });

  const chatAccessMutation = useMutation({
    mutationFn: chatService.accessChat,
    onSuccess: closeDrawer,
    onError: (err) => toastifyService.error(err),
  });

  const fetchChat = (userId: string) => {
    chatAccessMutation.mutate(userId);
  };

  const {
    data: users,
    isFetching: isUserFetch,
    isError,
  } = useQuery({
    queryKey: ["search", userSearch],
    queryFn: () => userService.searchUsers(userSearch),
    enabled: !!userSearch,
  });

  function fetchUsers() {
    if (!searchRef.current?.value) return;
    console.log("changed");
    setUserSearch(searchRef.current?.value);
  }

  return (
    <List sx={{ width: "100%" }}>
      <Stack mb={2} width={"100%"} alignItems={"center"}>
        <CustomSearchInput
          ref={searchRef}
          inputCursor="auto"
          placeholder="Search..."
          isIcon={false}
          onChange={debounce}
        />
        <span>{isLoading && searchRef.current?.value ? "loading" : null}</span>
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
              onClick={() => fetchChat(user._id)}
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
            </CustomListItem>
          ))}
        </Stack>
      )}
    </List>
  );
};

export default DrawerSearch;
