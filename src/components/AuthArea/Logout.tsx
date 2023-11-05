import { Typography, Box, SxProps, Theme } from "@mui/material";
import React from "react";
import { authService } from "../../services/authServices";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type LogoutProps = {
  sx?: SxProps<Theme>;
};
const Logout: React.FC<LogoutProps> = ({ sx }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    queryClient.clear();
    navigate("/auth");
  };

  return (
    <Box onClick={logout} sx={{ display: "flex", gap: 1, ...sx }}>
      <Typography color={"error"} sx={{ fontWeight: "bold" }}>
        Logout
      </Typography>
      <LogoutIcon sx={{ fill: "#d32f2f" }} />
    </Box>
  );
};

export default Logout;
