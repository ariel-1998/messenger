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

  const avatarIcon = <Avatar sx={iconSize} src={user?.image as string} />;

  return (
    <Box>
      <MuiAppBar position="static" sx={{ maxHeight: "60px" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Drawer>
              <DrawerSearch />
            </Drawer>
          </Box>
          <Typography variant={isSmallScreen ? "body1" : "h4"}>
            Messenger
          </Typography>
          <Box sx={{ display: "flex" }}>
            <CustomMenu icon={<Notifications />}>
              <Typography sx={menuItemPadding}>Messages</Typography>
            </CustomMenu>
            <CustomMenu icon={avatarIcon}>
              <ProfileModal user={user}>
                <Typography sx={menuItemPadding}>My profile</Typography>
              </ProfileModal>
              <Logout sx={menuItemPadding} />
            </CustomMenu>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
};

export default AppBar;
