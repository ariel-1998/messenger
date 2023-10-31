import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import React, { ReactNode } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery, useTheme } from "@mui/material";
import { useDrawer } from "../../contexts/DrawerProvider";

type DrawerProps = {
  children: ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const theme = useTheme();
  const medium = useMediaQuery(theme.breakpoints.up("md"));
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const { closeDrawer, openDrawer, open } = useDrawer();

  return (
    <>
      {medium ? (
        <CustomSearchInput
          disabled
          inputCursor="pointer"
          placeholder="Search..."
          onClick={openDrawer}
          disableFocusRipple
          disableRipple
        />
      ) : (
        <div style={{ cursor: "pointer" }}>
          <MenuIcon onClick={openDrawer} />
        </div>
      )}
      <MuiDrawer anchor={"left"} open={open} onClose={closeDrawer}>
        <Box
          sx={{
            width: small ? "70vw" : 400,
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "#eee",
            overflowY: "auto",
            m: 0,
            px: 2,
          }}
        >
          {children}
        </Box>
      </MuiDrawer>
    </>
  );
};

export default Drawer;
