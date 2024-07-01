import IconButton from "@mui/material/IconButton";
import React from "react";
import { CustomMenuProps } from "../CustomMenu";

const CustomMenu: React.FC<CustomMenuProps> = ({
  icon,
  children,
  open,
  onOpen,
  sx,
  ...rest
}) => {
  const openMenu = () => {
    onOpen();
  };

  return (
    <div data-testid="menu-field" {...rest}>
      <IconButton
        data-testid="open-menu-button"
        role="open-menu-button"
        sx={sx}
        onClick={openMenu}
      >
        {icon}
      </IconButton>
      {open && <div data-testid="menu-children">{children}</div>}
    </div>
  );
};

export default CustomMenu;
