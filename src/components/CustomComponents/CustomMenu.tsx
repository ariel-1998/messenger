import { Menu, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { ReactNode, useRef } from "react";

type CustomMenuProps = {
  icon?: ReactNode;
  menuItems: ReactNode[];
};

const CustomMenu: React.FC<CustomMenuProps> = ({ icon, menuItems }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!menuItems.length) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item, i) => (
          <MenuItem sx={{ padding: 0 }} key={i} onClick={handleClose}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default CustomMenu;
