import React, { useState } from "react";
import CustomMenu from "../CustomComponents/CustomMenu";
import ProfileModal from "../ProfileArea/ProfileModal";
import { RootState } from "../../utils/reduxStore";
import { useSelector } from "react-redux";
import { Avatar, MenuItem } from "@mui/material";
import Logout from "../AuthArea/Logout";
import { urlImageOptimize } from "../../utils/urlImageOptimize";
import { MENU_ITEM_PADDING } from "../../utils/constants";

const ProfileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const url = urlImageOptimize.generateIconImageUrl(user?.image as string);
  const avatarIcon = <Avatar sx={{ width: 30, height: 30 }} src={url} />;

  return (
    <CustomMenu onOpen={handleOpen} open={open} icon={avatarIcon}>
      <MenuItem sx={{ padding: 0 }} onClick={handleClose}>
        <ProfileModal.User
          btnText="My profile"
          sx={{ ...MENU_ITEM_PADDING, fontWeight: "bold" }}
          profile={user}
        />
      </MenuItem>
      <MenuItem sx={{ padding: 0 }} onClick={handleClose}>
        <Logout sx={{ ...MENU_ITEM_PADDING }} />
      </MenuItem>
    </CustomMenu>
  );
};

export default ProfileMenu;
