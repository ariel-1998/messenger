import { Typography, Box, SxProps, Theme } from "@mui/material";
import React from "react";
import { authService } from "../../services/authService";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type LogoutProps = {
  sx?: SxProps<Theme>;
};
const Logout: React.FC<LogoutProps> = ({ sx }) => {
  const { clear } = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    clear();
    navigate("/auth");
  };

  return (
    <Box
      onClick={logout}
      sx={{ display: "flex", gap: 1, ...sx }}
      data-testid="logout"
    >
      <Typography color={"error"} sx={{ fontWeight: "bold" }}>
        Logout
      </Typography>
      <LogoutIcon sx={{ fill: "#d32f2f" }} data-testid="icon" />
    </Box>
  );
};

export default Logout;
