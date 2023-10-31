import { Menu, SxProps, Theme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { ReactNode } from "react";

type CustomMenuProps = {
  icon?: ReactNode;
  children: ReactNode;
  open: boolean;
  onOpen: () => void;
  sx?: SxProps<Theme>;
};

const CustomMenu: React.FC<CustomMenuProps> = ({
  icon,
  children,
  open,
  onOpen,
  sx,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        sx={sx}
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
        open={Boolean(anchorEl) && open}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </div>
  );
};

export default CustomMenu;
