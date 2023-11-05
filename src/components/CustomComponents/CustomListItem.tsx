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
  disableBtnProps?: boolean;
} & ListItemProps;

const CustomListItem: React.FC<CustomListItemProps> = ({
  children,
  disableRipple = false,
  disableBtnProps = false,
  sx,
  ...rest
}) => {
  const btnSx: SxProps<Theme> = {
    height: "100%",
    borderRadius: "10px",
  };
  const disabledBtnProps: SxProps<Theme> = {
    ...btnSx,
    cursor: "auto",
    "&:hover": {
      bgcolor: "#ddd",
    },
  };
  return (
    <ListItem
      disablePadding
      sx={{
        bgcolor: "#f0f0f0",
        boxSizing: "border-box",
        borderRadius: "10px",
        ...sx,
      }}
      {...rest}
    >
      <ListItemButton
        disableRipple={disableRipple}
        disabled={disableBtnProps}
        sx={disableBtnProps ? disabledBtnProps : btnSx}
      >
        {children}
      </ListItemButton>
    </ListItem>
  );
};

export default CustomListItem;
