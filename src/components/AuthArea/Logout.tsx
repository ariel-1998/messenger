import { Typography, Box, SxProps, Theme } from "@mui/material";
import React from "react";
import { authService } from "../../services/authServices";
import { useNavigate } from "react-router-dom";
import { Logout as LogoutIcon, Padding } from "@mui/icons-material";

type LogoutProps = {
  sx?: SxProps<Theme>;
};
const Logout: React.FC<LogoutProps> = ({ sx }) => {
  const navigate = useNavigate();
  const logout = () => {
    authService.logout();
    navigate("/");
  };
  return (
    <Box onClick={logout} sx={{ display: "flex", gap: 1, ...sx }}>
      <Typography>Logout</Typography>
      <LogoutIcon />
    </Box>
  );
};

export default Logout;
