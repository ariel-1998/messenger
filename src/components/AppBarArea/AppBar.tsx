import {
  Box,
  AppBar as MuiAppBar,
  SxProps,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import Drawer from "./Drawer";
import DrawerSearch from "./DrawerSearch";
import ProfileMenu from "./ProfileMenu";
import NotificationMenu from "./NotificationMenu";

const AppBar: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const headerStyle: SxProps<Theme> = !isSmallScreen
    ? {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
      }
    : {};

  return (
    <Box
      boxSizing={"border-box"}
      sx={{
        height: "60px",
      }}
    >
      <MuiAppBar
        data-testid="mui-app-bar"
        sx={{
          width: "100%",
          position: "relative",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Toolbar
          data-testid="mui-tool-bar"
          sx={{ justifyContent: "space-between" }}
        >
          <Box data-testid="drawer-wrapper">
            <Drawer>
              <DrawerSearch />
            </Drawer>
          </Box>
          <Typography sx={headerStyle} variant={isSmallScreen ? "h6" : "h4"}>
            Messenger
          </Typography>
          <Box data-testid="menus-wrapper" sx={{ display: "flex" }}>
            <NotificationMenu />
            <ProfileMenu />
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
};

export default AppBar;
