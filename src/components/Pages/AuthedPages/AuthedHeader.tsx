import React from "react";
import AppBar from "../../AppBarArea/AppBar";
import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthedHeader: React.FC = () => {
  return (
    <Stack height={"100vh"}>
      <AppBar />
      <Outlet />
    </Stack>
  );
};

export default AuthedHeader;
