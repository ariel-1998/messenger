import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemProps,
  ListItemText,
} from "@mui/material";
import React, { ReactNode } from "react";

type CustomListItemProps = {
  text: string;
  children?: ReactNode;
} & ListItemProps;

const CustomListItem: React.FC<CustomListItemProps> = ({
  text,
  children,
  ...rest
}) => {
  return (
    <ListItem {...rest} disablePadding sx={{ bgcolor: "#ddd" }}>
      <ListItemButton>
        <ListItemText primary={text} />
        <ListItemIcon>{children}</ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
};

export default CustomListItem;
