import { Box, Tabs, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import CustomTabPanel from "../CustomComponents/CustomTabPanel";
import Login from "./Login";
import Register from "./Register";

const AuthMenu: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Login />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Register />
      </CustomTabPanel>
    </Box>
  );
};

export default AuthMenu;
