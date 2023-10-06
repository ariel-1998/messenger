import { Menu, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, {
  isValidElement,
  ReactNode,
  Children,
  cloneElement,
} from "react";

type CustomMenuProps = {
  icon?: ReactNode;
  children: ReactNode;
};

const CustomMenu: React.FC<CustomMenuProps> = ({ icon, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!children) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const childrenWithProps = Children.map(children, (child) => {
    if (!isValidElement(child)) return;
    return cloneElement(
      <MenuItem sx={{ padding: 0 }} onClick={handleClose}>
        {child}
      </MenuItem>
    );
  });

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
        {childrenWithProps}
      </Menu>
    </div>
  );
};

export default CustomMenu;
