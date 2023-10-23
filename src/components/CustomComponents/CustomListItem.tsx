import {
  ListItem,
  ListItemButton,
  ListItemProps,
  SxProps,
  Theme,
} from "@mui/material";
import React, { ReactNode } from "react";

type CustomListItemProps = {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  disableRipple?: boolean;
} & ListItemProps;

const CustomListItem: React.FC<CustomListItemProps> = ({
  children,
  disableRipple = false,
  sx,
  ...rest
}) => {
  return (
    <ListItem
      disablePadding
      sx={{
        bgcolor: "#ddd",
        boxSizing: "border-box",
        borderRadius: "10px",
        ...sx,
      }}
      {...rest}
    >
      <ListItemButton
        disableRipple={disableRipple}
        sx={{
          height: "100%",
          borderRadius: "10px",
        }}
      >
        {children}
      </ListItemButton>
    </ListItem>
  );
};

export default CustomListItem;
