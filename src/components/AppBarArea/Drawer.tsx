import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import React, { ReactNode, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { Search as SearchIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import { toastifyService } from "../../services/toastifyService";

type DrawerProps = {
  children: ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const [anchor, setAnchor] = useState(false);
  const toggleDrawer = () => setAnchor((prevAnchor) => !prevAnchor);

  //   const list = (
  //     <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
  //       <List>
  //         {["Inbox", "Starred", "Send email", "Drafts"].map((text) => (
  //           <ListItem key={text} disablePadding>
  //             <ListItemButton>
  //               <ListItemIcon>
  //                 <MailIcon />
  //               </ListItemIcon>
  //               <ListItemText primary={text} />
  //             </ListItemButton>
  //           </ListItem>
  //         ))}
  //       </List>
  //       <Divider />
  //       <List>
  //         {["All mail", "Trash", "Spam"].map((text, index) => (
  //           <ListItem key={text} disablePadding>
  //             <ListItemButton>
  //               <ListItemIcon>
  //                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
  //               </ListItemIcon>
  //               <ListItemText primary={text} />
  //             </ListItemButton>
  //           </ListItem>
  //         ))}
  //       </List>
  //     </Box>
  //   );

  return (
    <>
      <CustomSearchInput
        disabled
        inputCursor="pointer"
        placeholder="Search..."
        boxClick={toggleDrawer}
        disableFocusRipple
        disableRipple
      />
      <MuiDrawer anchor={"left"} open={anchor} onClose={toggleDrawer}>
        <div className="custom-scrollbar">
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
        </div>
      </MuiDrawer>
    </>
  );
};

export default Drawer;
