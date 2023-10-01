import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  SxProps,
  Theme,
} from "@mui/material";
import React from "react";
import { Notifications } from "@mui/icons-material";
import CustomMenu from "../CustomComponents/CustomMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import Logout from "../AuthArea/Logout";
import ProfileModal from "./ProfileModal";
import Drawer from "./Drawer";
import CustomListItem from "../CustomComponents/CustomListItem";

const iconSize: SxProps<Theme> = { width: 25, height: 25 };
const menuItemPadding: SxProps<Theme> = { px: 2, py: 1 };

const SideDrawer: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth);
  const avatarIcon = <Avatar sx={iconSize} src={user?.image as string} />;

  const notificationIcon = <Notifications sx={iconSize} />;
  const avatatMenuItems = [
    <ProfileModal sx={menuItemPadding} />,
    <Logout sx={menuItemPadding} />,
  ];

  return (
    <Box>
      <AppBar position="static" sx={{ maxHeight: "60px" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Drawer>
              <CustomListItem text={"Notifications"}>
                <Notifications />
              </CustomListItem>
            </Drawer>
          </Box>
          <Typography variant="h4">Messenger</Typography>
          <Box sx={{ display: "flex" }}>
            <CustomMenu icon={notificationIcon} menuItems={["notofication"]} />
            <CustomMenu icon={avatarIcon} menuItems={avatatMenuItems} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default SideDrawer;
