import { Container, Box, Typography } from "@mui/material";
import React from "react";
import AuthMenu from "../../AuthArea/AuthMenu";

const borderRadius = "10px";
const UnauthedHome: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
          bgcolor: "white",
          m: "40px 0 15px 0",
          borderRadius,
        }}
      >
        <Typography variant="h4">Welcome to Messenger</Typography>
      </Box>
      <Box bgcolor="white" p={3} borderRadius={borderRadius}>
        <AuthMenu />
      </Box>
    </Container>
  );
};

export default UnauthedHome;
