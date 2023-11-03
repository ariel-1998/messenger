import {
  List,
  Avatar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import React, { useRef, useState } from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toastifyService } from "../../services/toastifyService";
import { userService } from "../../services/userService";
import { Search as SearchIcon } from "@mui/icons-material";
import LoadingSkeletons, {
  SkeletonUser,
} from "../CustomComponents/LoadingSkeletons";
import { chatService } from "../../services/chatService";
import { useDrawer } from "../../contexts/DrawerProvider";
import useDebounce from "../../hooks/useDebounce";
import ListItems from "../ChatArea/GroupForms/ListItems";
import CustomTypo from "../CustomComponents/CustomTypo";

const DrawerSearch: React.FC = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [userSearch, setUserSearch] = useState("");
  const { closeDrawer } = useDrawer();
  const { debounce, isLoading } = useDebounce({ fn: fetchUsers, wait: 700 });
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

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
    setUserSearch(searchRef.current?.value);
  }

  return (
    <Box
      sx={{
        width: small ? "80vw" : 400,
        height: "100vh",
        bgcolor: "#eee",
        overflowY: isUserFetch ? "hidden" : "auto",
        m: 0,
        px: 1,
      }}
    >
      <List sx={{ width: "100%", pt: 0 }}>
        <Stack
          margin={"auto"}
          position={"sticky"}
          top={0}
          zIndex={1}
          py={1}
          bgcolor={"#eee"}
        >
          <Box position={"relative"}>
            <CustomSearchInput
              ref={searchRef}
              isIcon={false}
              placeholder="Search..."
              onChange={debounce}
              style={{
                width: "100%",
                marginBottom: "10px",
                paddingRight: "55px",
              }}
            />
            <Stack
              direction={"row"}
              justifyContent={"space-around"}
              gap={1}
              sx={{ position: "absolute", top: 8, right: 20, width: 30 }}
            >
              <Divider
                orientation="vertical"
                flexItem
                sx={{ justifySelf: "start" }}
              />
              <Box width={20}>
                {!isLoading ? (
                  <SearchIcon sx={{ fill: "#999" }} />
                ) : (
                  <CircularProgress size={20} />
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>

        {isError && <Typography align="center">Users not found!</Typography>}

        {isUserFetch && (
          <Stack spacing={1}>
            <LoadingSkeletons amount={12}>
              <SkeletonUser />
            </LoadingSkeletons>
          </Stack>
        )}

        {users && (
          <Stack spacing={1} pb={2}>
            {users.map((user) => (
              <ListItems.User
                key={user._id}
                user={user}
                onClick={() => fetchChat(user._id)}
              />
            ))}
          </Stack>
        )}
      </List>
    </Box>
  );
};

export default DrawerSearch;
