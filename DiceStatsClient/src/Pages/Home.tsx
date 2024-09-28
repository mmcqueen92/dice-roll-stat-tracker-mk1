import React from "react";
import SmallContent from "../Components/SmallContent";
import { Box, Button } from "@mui/material";
import { useRedirectIfAuthenticated } from "../Hooks/useRedirectIfAuthenticated";

export default function Home() {
  useRedirectIfAuthenticated();
  return (
    <SmallContent>
      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="space-between"
        sx={{ gap: "16px" }}
      >
        <Button variant="contained" color="primary" href="/login">
          Login
        </Button>
        <Button variant="contained" color="primary" href="/register">
          Register
        </Button>
      </Box>
    </SmallContent>
  );
}
