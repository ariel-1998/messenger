import React from "react";
import CustomMenu from "../CustomComponents/CustomMenu";
import ProfileModal from "../ProfileArea/ProfileModal";
import { RootState } from "../../utils/reduxStore";
import { useSelector } from "react-redux";
import { Avatar, MenuItem } from "@mui/material";
import Logout from "../AuthArea/Logout";

export const MENU_ITEM_PADDING = { px: 2, py: 1, width: "100%" };

const ProfileMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const user = useSelector((state: RootState) => state.auth);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const AvatarIcon = () => (
    <Avatar sx={{ width: 25, height: 25 }} src={user?.image as string} />
  );

  return (
    <CustomMenu onOpen={handleOpen} open={open} icon={<AvatarIcon />}>
      <MenuItem onClick={handleClose}>
        <ProfileModal.User
          btnText="My profile"
          sx={MENU_ITEM_PADDING}
          profile={user}
        />
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <Logout sx={MENU_ITEM_PADDING} />
      </MenuItem>
    </CustomMenu>
  );
};

export default ProfileMenu;
