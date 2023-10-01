import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { ReactNode } from "react";

type CustomListItemProps = {
  text: string;
  children: ReactNode;
};

const CustomListItem: React.FC<CustomListItemProps> = ({ text, children }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>{children}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default CustomListItem;
