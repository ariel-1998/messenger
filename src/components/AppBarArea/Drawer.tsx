import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import React, { ReactNode, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery, useTheme } from "@mui/material";

type DrawerProps = {
  children: ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const [anchor, setAnchor] = useState(false);
  const toggleDrawer = () => setAnchor((prevAnchor) => !prevAnchor);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      {matches ? (
        <CustomSearchInput
          disabled
          inputCursor="pointer"
          placeholder="Search..."
          boxClick={toggleDrawer}
          disableFocusRipple
          disableRipple
        />
      ) : (
        <div style={{ cursor: "pointer" }}>
          <MenuIcon onClick={toggleDrawer} />
        </div>
      )}
      <MuiDrawer anchor={"left"} open={anchor} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 270,
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "#eee",
            overflowY: "auto",
            m: 0,
            p: 0,
          }}
        >
          {children}
        </Box>
      </MuiDrawer>
    </>
  );
};

export default Drawer;
