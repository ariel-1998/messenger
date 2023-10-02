import { List, Box, Skeleton, Avatar, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import { useQuery } from "@tanstack/react-query";
import { toastifyService } from "../../services/toastifyService";
import { userService } from "../../services/userService";
import CustomListItem from "../CustomComponents/CustomListItem";
import LoadingSkeletons from "../CustomComponents/LoadingSkeletons";

const SearchError: React.FC = () => {
  return <Typography align="center">Users not found!</Typography>;
};

const DrawerSearch: React.FC = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [dependency, setDependency] = useState(false);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["search", searchRef.current?.value || ""],
    queryFn: () => userService.searchUsers(searchRef.current?.value || ""),
    enabled,
  });

  useEffect(() => {
    if (isFetching) return;
    setEnabled(false);
  }, [dependency]);

  const fetchUsers = () => {
    if (!searchRef.current?.value)
      return toastifyService.info("Fill Search bar!");
    setDependency((prev) => !prev);
  };

  return (
    <List>
      <Box mb={2}>
        <CustomSearchInput
          ref={searchRef}
          inputCursor="auto"
          placeholder="Search..."
          iconClick={fetchUsers}
          disabled={isFetching}
        />
      </Box>

      {isError && <SearchError />}

      {isFetching && (
        <Stack height={"88vh"}>
          <LoadingSkeletons amount={12} />
        </Stack>
      )}

      {data && (
        <Stack spacing={1} pb={2}>
          {data.map((user) => (
            <CustomListItem key={user._id} text={user.name}>
              <Avatar src={user.image as string} />
            </CustomListItem>
          ))}
        </Stack>
      )}
    </List>
  );
};

export default DrawerSearch;
