import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import React, { ReactNode } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
import useDrawer from "../../hooks/useDrawer";

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
        <Box
          sx={{
            position: "relative",
          }}
        >
          <div
            role="drawer-opener"
            onClick={openDrawer}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 1,
              cursor: "pointer",
            }}
          />
          <CustomSearchInput
            disabled
            id="disabled-input"
            placeholder="Search..."
            disableFocusRipple
            disableRipple
          />
        </Box>
      ) : (
        <IconButton
          role="drawer-opener"
          onClick={openDrawer}
          sx={{ color: "white" }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <MuiDrawer
        data-testid="mui-drawer"
        anchor={"left"}
        open={open}
        onClose={closeDrawer}
      >
        {children}
      </MuiDrawer>
    </>
  );
};

export default Drawer;
