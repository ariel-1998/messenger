import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import React, { ReactNode } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useDrawer } from "../../contexts/DrawerProvider";

type DrawerProps = {
  children: ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const theme = useTheme();
  const medium = useMediaQuery(theme.breakpoints.up("md"));
  const { closeDrawer, openDrawer, open } = useDrawer();

  return (
    <>
      {medium ? (
        <CustomSearchInput
          disabled
          inputCursor="pointer"
          placeholder="Search..."
          handleClick={openDrawer}
          disableFocusRipple
          disableRipple
        />
      ) : (
        <IconButton onClick={openDrawer} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>
      )}
      <MuiDrawer anchor={"left"} open={open} onClose={closeDrawer}>
        {children}
      </MuiDrawer>
    </>
  );
};

export default Drawer;
