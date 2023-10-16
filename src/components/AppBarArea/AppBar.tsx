import {
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Avatar,
  SxProps,
  Theme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { Notifications } from "@mui/icons-material";
import CustomMenu from "../CustomComponents/CustomMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import Logout from "../AuthArea/Logout";
import ProfileModal from "../ProfileArea/ProfileModal";
import Drawer from "./Drawer";
import DrawerSearch from "./DrawerSearch";

const iconSize: SxProps<Theme> = { width: 25, height: 25 };
const menuItemPadding: SxProps<Theme> = { px: 2, py: 1, width: "100%" };

const AppBar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const AvatarIcon = <Avatar sx={iconSize} src={user?.image as string} />;

  return (
    <Box
      boxSizing={"border-box"}
      sx={{
        height: "60px",
      }}
    >
      <MuiAppBar
        sx={{
          width: "100%",
          position: "relative",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Drawer>
              <DrawerSearch />
            </Drawer>
          </Box>
          <Typography
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            variant={isSmallScreen ? "h6" : "h4"}
          >
            Messenger
          </Typography>
          <Box sx={{ display: "flex" }}>
            <CustomMenu icon={<Notifications />}>
              <Typography sx={menuItemPadding}>Messages</Typography>
            </CustomMenu>
            <CustomMenu icon={AvatarIcon}>
              <ProfileModal.User
                btnText="My profile"
                sx={menuItemPadding}
                profile={user}
              />
              <Logout sx={menuItemPadding} />
            </CustomMenu>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
};

export default AppBar;
