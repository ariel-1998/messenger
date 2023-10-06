import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import React, {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useState,
} from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery, useTheme } from "@mui/material";

type DrawerProps = {
  children: ReactNode;
};

type DrawerChildProps = {
  toggleDrawer?: () => void;
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const [anchor, setAnchor] = useState(false);
  const toggleDrawer = () => setAnchor((prevAnchor) => !prevAnchor);
  const theme = useTheme();
  const medium = useMediaQuery(theme.breakpoints.up("md"));
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const ChildrenWithProps = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement<DrawerChildProps>(
      child as ReactElement<DrawerChildProps>,
      { toggleDrawer }
    );
  });

  return (
    <>
      {medium ? (
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
          {ChildrenWithProps}
        </Box>
      </MuiDrawer>
    </>
  );
};

export default Drawer;
