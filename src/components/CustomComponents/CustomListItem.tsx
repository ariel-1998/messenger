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
    <ListItem disablePadding sx={{ bgcolor: "#ddd" }}>
      <ListItemButton>
        <ListItemText primary={text} />
        <ListItemIcon>{children}</ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
};

export default CustomListItem;
