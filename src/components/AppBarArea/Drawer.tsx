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

type DrawerProps = {
  children: ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const [anchor, setAnchor] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const toggleDrawer = () => setAnchor((prevAnchor) => !prevAnchor);

  const fetchUsers = async () => {
    if (!searchRef.current?.value) return console.log("no value");
    // return console.log(searchRef.current.value);
    try {
      const data = await userService.searchUsers(searchRef.current?.value);
      console.log(data);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  // useQuery(
  //   {
  //     queryKey: ["search", { search: searchRef.current?.value }],
  //     queryFn: () => userService.searchUsers(searchRef.current?.value || ""),
  //   },
  //   { onSuccess: (data) => console.log(data) }
  // );
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
    <div>
      <div>
        <CustomSearchInput
          disabled
          inputCursor="pointer"
          placeholder="Search..."
          boxClick={toggleDrawer}
        />
        <MuiDrawer anchor={"left"} open={anchor} onClose={toggleDrawer}>
          <Box
            sx={{
              width: 250,
              display: "flex",
              justifyContent: "center",
              mb: 5,
            }}
          >
            <List>
              <Box mb={2}>
                <CustomSearchInput
                  ref={searchRef}
                  inputCursor="auto"
                  placeholder="Search..."
                  iconClick={fetchUsers}
                />
              </Box>
              {children}
            </List>
          </Box>
        </MuiDrawer>
      </div>
      {/* {(["left"] as const).map((anchorText) => (
        <div key={anchorText}>
          <Button onClick={toggleDrawer}>{anchorText}</Button>
          <MuiDrawer anchor={anchorText} open={anchor} onClose={toggleDrawer}>
            {list}
          </MuiDrawer>
        </div>
      ))} */}
    </div>
  );
};

export default Drawer;
