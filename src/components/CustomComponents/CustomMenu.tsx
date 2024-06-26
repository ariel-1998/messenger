import { Menu, SxProps, Theme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { ComponentProps, ReactNode, useState } from "react";

export type CustomMenuProps = {
  icon?: ReactNode;
  children: ReactNode;
  open: boolean;
  onOpen: () => void;
  sx?: SxProps<Theme>;
} & ComponentProps<"div">;

const CustomMenu: React.FC<CustomMenuProps> = ({
  icon,
  children,
  open,
  onOpen,
  sx,
  ...rest
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div data-testid="menu-field" {...rest}>
      <IconButton
        role="open-menu-button"
        data-testid="open-menu-button"
        sx={sx}
        size="large"
        onClick={handleMenu}
        color="inherit"
      >
        {icon}
      </IconButton>
      <Menu
        sx={{ ".MuiMenu-paper": { background: "#F0F0F0", color: "#333333" } }}
        anchorEl={anchorEl}
        data-testid="menu-list"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
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
