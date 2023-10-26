import React from "react";
import CustomMenu from "../CustomComponents/CustomMenu";
import { Notifications } from "@mui/icons-material";
import { MenuItem, Typography } from "@mui/material";
import { MENU_ITEM_PADDING } from "./ProfileMenu";

const NotificationMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <CustomMenu icon={<Notifications />} open={open} onOpen={handleOpen}>
      <MenuItem sx={{ padding: 0 }} onClick={handleClose}>
        <Typography sx={MENU_ITEM_PADDING}>Messages</Typography>
      </MenuItem>
    </CustomMenu>
  );
};

export default NotificationMenu;
