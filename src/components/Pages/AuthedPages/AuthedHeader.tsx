import React from "react";
import AppBar from "../../AppBarArea/AppBar";
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthedHeader: React.FC = () => {
  return (
    <Stack p={0} m={0} height={"100vh"}>
      <AppBar />
      <Box height={"calc(100vh - 60px)"}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default AuthedHeader;
