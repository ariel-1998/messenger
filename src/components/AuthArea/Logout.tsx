import { Typography, Box, SxProps, Theme } from "@mui/material";
import React from "react";
import { authService } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { Logout as LogoutIcon } from "@mui/icons-material";

type LogoutProps = {
  sx?: SxProps<Theme>;
};
const Logout: React.FC<LogoutProps> = ({ sx }) => {
  const logout = () => {
    authService.logout();
    window.location.reload();
    window.location.href = "/auth";
  };
  return (
    <Box onClick={logout} sx={{ display: "flex", gap: 1, ...sx }}>
      <Typography sx={{ fontWeight: "bold" }}>Logout</Typography>
      <LogoutIcon />
    </Box>
  );
};

export default Logout;
